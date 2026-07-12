/**
 * ==============================================================================
 * TITLE:       PostgresConnectionPool.spec.ts (Enterprise Integration Spec)
 * ARCHITECT:   L15 Principle Ultra-FAANG Systems Architect
 * EXPERIENCE:  50+ Years Legacy Systems & Hyper-scale Infrastructure Philosophy
 * COMPLIANCE:  TypeScript Strict Mode, Infrastructure Isolation, Clean Architecture
 * ==============================================================================
 * This integration test operates directly against virtualized Postgres infrastructure.
 * It simulates edge-case network anomalies, pool starvation, and circuit-breaking.
 */

import { Pool, PoolClient } from 'pg';

// ==============================================================================
// 1. DOMAIN CONTRACTS & INFRASTRUCTURE ADAPTER (CLEAN ARCHITECTURE INTERFACE)
// ==============================================================================

interface IDatabaseMetrics {
  totalConnections: number;
  idleConnections: number;
  waitingRequests: number;
}

class PostgresConnectionPoolManager {
  private pool: Pool;
  private readonly maxPoolSize: number;

  constructor(connectionString: string, maxConnections = 10) {
    this.maxPoolSize = maxConnections;
    this.pool = new Pool({
      connectionString,
      max: this.maxPoolSize,
      idleTimeoutMillis: 5000,
      connectionTimeoutMillis: 2000, // Strict Ultra-FAANG fail-fast window
      maxUses: 7500 // Prevents long-term memory bloat
    });

    // Centralized Telemetry Sink
    this.pool.on('error', (err) => {
      console.error('[INFRA-DB-POOL-CRITICAL] Unexpected asynchronous failure on idle client:', err);
    });
  }

  public async executeQuery<T>(sql: string, params: any[] = [], timeoutMs = 1500): Promise<T[]> {
    const client: PoolClient = await this.pool.connect();
    
    // Clean Architecture Interceptor: Implements Query Timeout at the Driver Layer
    const timeoutRace = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error(`Query execution aborted: Exceeded timeout threshold of ${timeoutMs}ms`)), timeoutMs)
    );

    try {
      const queryExecution = client.query(sql, params);
      const result = await Promise.race([queryExecution, timeoutRace]);
      return (result as any).rows;
    } finally {
      // Guaranteed resource release to prevent connection leaks
      client.release();
    }
  }

  public getLiveMetrics(): IDatabaseMetrics {
    return {
      totalConnections: this.pool.totalCount,
      idleConnections: this.pool.idleCount,
      waitingRequests: this.pool.waitingCount
    };
  }

  public async shutdownGracefully(): Promise<void> {
    console.log('[INFRA-DB-POOL] Releasing all allocated sockets...');
    await this.pool.end();
  }
}

// ==============================================================================
// 2. INTEGRATION MATRIX (JEST / VITEST RUNTIME ENVIRONMENT)
// ==============================================================================

describe('Integration Engine: PostgreSQL Connection Infrastructure Pipeline', () => {
  // Use environment configurations injected by apex-orchestrator.sh
  const TEST_DB_URL = process.env.DATABASE_URL || 'postgresql://postgres:postgres_root_pwd@localhost:5432/portfolio_db_test';
  const MAX_POOL_LIMIT = 5;
  let poolManager: PostgresConnectionPoolManager;

  beforeEach(() => {
    poolManager = new PostgresConnectionPoolManager(TEST_DB_URL, MAX_POOL_LIMIT);
  });

  afterEach(async () => {
    await poolManager.shutdownGracefully();
  });

  // ----------------------------------------------------------------------------
  // TEST SCENARIO 1: DETERMINISTIC RESOURCE ACQUISITION
  // ----------------------------------------------------------------------------
  it('should provision stable infrastructure sockets and execute read operations', async () => {
    const sql = 'SELECT 1 + 1 AS verification_node;';
    const result = await poolManager.executeQuery<{ verification_node: number }>(sql);

    expect(result).toBeDefined();
    expect(result[0].verification_node).toBe(2);
    
    const metrics = poolManager.getLiveMetrics();
    expect(metrics.totalConnections).toBeLessThanOrEqual(MAX_POOL_LIMIT);
    expect(metrics.idleConnections).toBe(1); // Client should return to idle pool instantly
  });

  // ----------------------------------------------------------------------------
  // TEST SCENARIO 2: POOL SATURATION & PRESSURE CAPACITY (CHAOS TESTING)
  // ----------------------------------------------------------------------------
  it('should successfully queue and serialize requests during absolute pool saturation', async () => {
    // Generate simulated load exceeding the maximum pool capability simultaneously
    const totalSimulatedQueries = 12; 
    const targetQueryString = 'SELECT pg_sleep(0.1), $1::int AS payload;';

    const concurrentExecutionPromises = Array.from({ length: totalSimulatedQueries }).map((_, index) =>
      poolManager.executeQuery<{ payload: number }>(targetQueryString, [index])
    );

    // Actively verify queue state before promises settle
    const pendingMetrics = poolManager.getLiveMetrics();
    expect(pendingMetrics.totalConnections).toBe(MAX_POOL_LIMIT);
    expect(pendingMetrics.waitingRequests).toBeGreaterThan(0); // Excess queries must wait in memory queue

    const executionResults = await Promise.all(concurrentExecutionPromises);

    expect(executionResults.length).toBe(totalSimulatedQueries);
    expect(executionResults[0][0].payload).toBe(0);

    const postSettledMetrics = poolManager.getLiveMetrics();
    expect(postSettledMetrics.waitingRequests).toBe(0); // Backlog completely cleared
    expect(postSettledMetrics.idleConnections).toBe(MAX_POOL_LIMIT);
  });

  // ----------------------------------------------------------------------------
  // TEST SCENARIO 3: CONTEXT TIMEOUT INTERCEPTION & ANTI-LEAK SHIELD
  // ----------------------------------------------------------------------------
  it('should hard-abort queries that run past the configured execution timeout threshold without spoiling sockets', async () => {
    // Force a database-level freeze that lasts longer than the query execution timeout limit
    const maliciousLongQuery = 'SELECT pg_sleep(5);'; 
    const strictTimeoutThreshold = 200; 

    await expect(
      poolManager.executeQuery(maliciousLongQuery, [], strictTimeoutThreshold)
    ).rejects.toThrow('Query execution aborted: Exceeded timeout threshold');

    // Crucial Clean Architecture check: The socket must be recycled back into the pool regardless of the failure
    // If the socket is trapped, subsequent queries will fail due to starvation.
    const recoveryQueryResult = await poolManager.executeQuery<{ health_check: boolean }>('SELECT true AS health_check;');
    expect(recoveryQueryResult[0].health_check).toBe(true);
  });

  // ----------------------------------------------------------------------------
  // TEST SCENARIO 4: CORRUPTED SOCKET SELF-HEALING (NETWORK PARTITION RESILIENCE)
  // ----------------------------------------------------------------------------
  it('should transparently self-heal and re-establish connection sockets if the underlying database severs connection handles', async () => {
    // 1. Establish an operational socket base
    await poolManager.executeQuery('SELECT 1;');
    let currentMetrics = poolManager.getLiveMetrics();
    expect(currentMetrics.totalConnections).toBe(1);

    // 2. Simulate a sudden network sever by terminating active backends at the engine level
    // This executes an internal administrative cancel on all existing connections to simulate a network drop.
    await poolManager.executeQuery("SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE pid <> pg_backend_pid() AND datname = current_database();");

    // 3. Immediately trigger a secondary query. The pool must detect dead sockets, drop them, and transparently spawn a fresh new one.
    const validationResult = await poolManager.executeQuery<{ live_status: string }>("SELECT 'ONLINE' AS live_status;");
    
    expect(validationResult[0].live_status).toBe('ONLINE');
  });
});
