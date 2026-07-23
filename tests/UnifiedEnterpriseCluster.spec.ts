```ts
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  createEnterpriseCluster,
  type ClusterNode,
  type EnterpriseCluster,
} from '../../src/infrastructure/UnifiedEnterpriseCluster.js';

const NODE_IDS = ['primary', 'secondary', 'standby'] as const;
const createNode = (
  id: string,
  overrides: Partial<ClusterNode> = {},
): ClusterNode => ({
  id,
  region: 'ap-south-1',
  healthy: true,
  weight: 1,
  activeConnections: 0,
  ...overrides,
});
describe('UnifiedEnterpriseCluster', () => {
  let cluster: EnterpriseCluster;
  beforeEach(() => {
    vi.useFakeTimers();
    cluster = createEnterpriseCluster({
      nodes: [
        createNode('primary'),
        createNode('secondary', { region: 'ap-southeast-1' }),
        createNode('standby', { region: 'eu-west-1' }),
      ],
      healthCheckIntervalMs: 1_000,
      failureThreshold: 2,
    });
  });

  afterEach(async () => {
    await cluster.close();
    vi.restoreAllMocks();
    vi.useRealTimers();
  });
  it('starts with all healthy nodes ready', async () => {
    await cluster.start();
    expect(cluster.status()).toMatchObject({
      state: 'ready',
      totalNodes: 3,
      healthyNodes: 3,
      activeConnections: 0,
    });
  });

  it('routes traffic to the least-loaded healthy node', async () => {
    cluster.updateNode('primary', { activeConnections: 8 });
    cluster.updateNode('secondary', { activeConnections: 2 });
    cluster.updateNode('standby', { activeConnections: 5 });
    const lease = await cluster.acquire();
    expect(lease.id).toBe('secondary');
    cluster.release(lease.id);
  });
  it('excludes unhealthy nodes from routing', async () => {
    cluster.updateNode('primary', { healthy: false });
    cluster.updateNode('secondary', { activeConnections: 4 });
    const lease = await cluster.acquire();
    expect(lease.id).toBe('standby');
    expect(lease.healthy).toBe(true);
    cluster.release(lease.id);
  });

  it('fails over after the configured failure threshold', async () => {
    const probe = vi.spyOn(cluster, 'probe').mockResolvedValue(false);
    await cluster.start();
    await vi.advanceTimersByTimeAsync(2_000);
    expect(probe).toHaveBeenCalledTimes(2);
    expect(cluster.getNode('primary')?.healthy).toBe(false);
    const lease = await cluster.acquire();
    expect(lease.id).not.toBe('primary');
    cluster.release(lease.id);
  });

  it('restores recovered nodes without restarting', async () => {
    cluster.updateNode('primary', { healthy: false });
    cluster.updateNode('primary', {
      healthy: true,
      activeConnections: 0,
    });

    const lease = await cluster.acquire();
    expect(lease.id).toBe('primary');
    cluster.release(lease.id);
  });
  it('balances concurrent acquisitions across healthy nodes', async () => {
    const leases = await Promise.all(
      Array.from({ length: 12 }, () => cluster.acquire()),
    );
    const counts = leases.reduce<Record<string, number>>((result, { id }) => {
      result[id] = (result[id] ?? 0) + 1;
      return result;
    }, {});

    expect(Object.keys(counts)).toHaveLength(3);
    expect(Math.max(...Object.values(counts))).toBeLessThanOrEqual(4);
    leases.forEach(({ id }) => cluster.release(id));
    expect(cluster.status().activeConnections).toBe(0);
  });
  it('rejects traffic when every node is unavailable', async () => {
    NODE_IDS.forEach((id) =>
      cluster.updateNode(id, { healthy: false }),
    );

    await expect(cluster.acquire()).rejects.toMatchObject({
      code: 'CLUSTER_UNAVAILABLE',
    });
  });
  it('prevents connection counters from becoming negative', () => {
    cluster.release('primary');
    cluster.release('primary');
    expect(cluster.getNode('primary')?.activeConnections).toBe(0);
  });

  it('rejects duplicate node registration', () => {
    expect(() =>
      cluster.register(createNode('primary')),
    ).toThrowError(
      expect.objectContaining({
        code: 'DUPLICATE_CLUSTER_NODE',
      }),
    );
  });

  it('drains a node before removing it', async () => {
    const lease = await cluster.acquire();
    cluster.drain(lease.id);
    expect(cluster.getNode(lease.id)?.draining).toBe(true);
    cluster.release(lease.id);
    await cluster.remove(lease.id);
    expect(cluster.getNode(lease.id)).toBeUndefined();
    expect(cluster.status().totalNodes).toBe(2);
  });

  it('closes cleanly and rejects new traffic', async () => {
    await cluster.start();
    await cluster.close();
    expect(cluster.status().state).toBe('closed');
    await expect(cluster.acquire()).rejects.toMatchObject({
      code: 'CLUSTER_CLOSED',
    });
  });
});
```
