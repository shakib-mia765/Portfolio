import { randomUUID } from 'node:crypto';
import type { Pool, PoolClient } from 'pg';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { createPostgresPool } from '../../src/lib/database/postgres.js';

const connectionString =
  process.env.TEST_DATABASE_URL ?? process.env.DATABASE_URL;
const suite = connectionString ? describe : describe.skip;
const MAX_CONNECTIONS = 4;
suite('Postgres connection pool', () => {
  let pool: Pool;
  beforeAll(async () => {
    pool = createPostgresPool({
      connectionString,
      max: MAX_CONNECTIONS,
      application_name: `portfolio-test-${process.pid}`,
    });
    await pool.query('SELECT 1');
  });
  afterAll(async () => {
    await pool?.end();
  });
  it('executes queries through the configured database', async () => {
    const result = await pool.query<{
      database: string;
      user: string;
    }>('SELECT current_database() AS database, current_user AS user');
    expect(result.rowCount).toBe(1);
    expect(result.rows[0]?.database).toEqual(expect.any(String));
    expect(result.rows[0]?.user).toEqual(expect.any(String));
  });
  it('releases checked-out clients back to the pool', async () => {
    const client = await pool.connect();
    try {
      const result = await client.query<{ value: number }>(
        'SELECT 1::int AS value',
      );

      expect(result.rows[0]?.value).toBe(1);
      expect(pool.totalCount).toBeGreaterThanOrEqual(1);
    } finally {
      client.release();
    }
    expect(pool.idleCount).toBeGreaterThanOrEqual(1);
  });
  it('respects the configured connection limit', async () => {
    const clients: PoolClient[] = [];
    try {
      await Promise.all(
        Array.from({ length: MAX_CONNECTIONS }, async () => {
          clients.push(await pool.connect());
        }),
      );

      expect(pool.totalCount).toBeLessThanOrEqual(MAX_CONNECTIONS);
    } finally {
      clients.forEach((client) => client.release());
    }
  });
  it('isolates and rolls back transactional writes', async () => {
    const client = await pool.connect();
    const value = randomUUID();
    try {
      await client.query('BEGIN');
      await client.query(
        'CREATE TEMP TABLE pool_test(value text) ON COMMIT DROP',
      );
      await client.query('INSERT INTO pool_test(value) VALUES ($1)', [value]);

      const result = await client.query<{ value: string }>(
        'SELECT value FROM pool_test',
      );
      expect(result.rows[0]?.value).toBe(value);
      await client.query('ROLLBACK');
    } finally {
      client.release();
    }
  });
  it('remains usable after a failed query', async () => {
    await expect(
      pool.query('SELECT * FROM __missing_pool_test_table__'),
    ).rejects.toMatchObject({
      code: '42P01',
    });
    const result = await pool.query<{ healthy: number }>(
      'SELECT 1::int AS healthy',
    );
    expect(result.rows[0]?.healthy).toBe(1);
  });
  it('handles concurrent work without leaking clients', async () => {
    const values = await Promise.all(
      Array.from({ length: 12 }, (_, index) =>
        pool
          .query<{ value: number }>('SELECT $1::int AS value', [index])
          .then(({ rows }) => rows[0]?.value),
      ),
    );
    
    expect(values).toEqual(Array.from({ length: 12 }, (_, index) => index));
    expect(pool.waitingCount).toBe(0);
    expect(pool.totalCount).toBeLessThanOrEqual(MAX_CONNECTIONS);
    expect(pool.idleCount).toBe(pool.totalCount);
  });
});
