```ts
import { PrismaClient } from '@prisma/client';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

const databaseUrl = process.env.DATABASE_URL;
const safeDatabasePattern = /(test|ci|integration)/i;
const prisma = new PrismaClient({
  log: process.env.DEBUG_PRISMA === 'true' ? ['warn', 'error'] : ['error'],
});
const assertSafeDatabase = (): void => {
  if (!databaseUrl) throw new Error('DATABASE_URL is required.');
  const databaseName = new URL(databaseUrl).pathname.slice(1);
  if (!safeDatabasePattern.test(databaseName)) {
    throw new Error(`Refusing to test against "${databaseName}".`);
  }
};
const queryOne = async (): Promise<number> => {
  const [row] = await prisma.$queryRaw<Array<{ value: number }>>`
    SELECT 1::int AS value
  `;
  return row?.value ?? 0;
};
describe.sequential('Prisma infrastructure pipeline', () => {
  beforeAll(async () => {
    assertSafeDatabase();
    await prisma.$connect();
  });
  afterAll(() => prisma.$disconnect());
  it('connects to the configured datasource', async () => {
    await expect(queryOne()).resolves.toBe(1);
  });
  it('uses the expected database and schema', async () => {
    const [identity] = await prisma.$queryRaw<
      Array<{ database: string; schema: string }>
    >`
      SELECT current_database() AS database, current_schema() AS schema
    `;
    expect(identity?.database).toMatch(safeDatabasePattern);
    expect(identity?.schema).toBeTruthy();
  });
  it('commits successful transactions', async () => {
    const result = await prisma.$transaction(async (tx) => {
      const [row] = await tx.$queryRaw<Array<{ total: number }>>`
        SELECT (20 + 22)::int AS total
      `;
      return row?.total;
    });
    expect(result).toBe(42);
  });
  it('rolls back failed transactions', async () => {
    await expect(
      prisma.$transaction(async (tx) => {
        await tx.$executeRaw`
          CREATE TEMP TABLE prisma_pipeline_probe (
            id text PRIMARY KEY
          ) ON COMMIT DROP
        `;
        await tx.$executeRaw`
          INSERT INTO prisma_pipeline_probe (id)
          VALUES ('rollback-probe')
        `;
        throw new Error('ROLLBACK_PROBE');
      }),
    ).rejects.toThrow('ROLLBACK_PROBE');
    const [result] = await prisma.$queryRaw<Array<{ exists: boolean }>>`
      SELECT to_regclass('pg_temp.prisma_pipeline_probe') IS NOT NULL AS exists
    `;
    expect(result?.exists).toBe(false);
  });
  it('handles concurrent queries', async () => {
    const results = await Promise.all(
      Array.from({ length: 8 }, queryOne),
    );
    expect(results).toEqual(Array(8).fill(1));
  });
  it('surfaces invalid query errors', async () => {
    await expect(
      prisma.$executeRawUnsafe(
        'SELECT * FROM __missing_prisma_pipeline_table__',
      ),
    ).rejects.toBeInstanceOf(Error);
  });
});
```
