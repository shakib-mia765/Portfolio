```js
import { beforeEach, describe, expect, it } from 'vitest';
import { RegistryIngressEngine } from '../../src/components/features/skills/services/RegistryIngress.js';

const TOKEN = 'secure_registry_token_2026_abcdefghijklmnopqrstuvwxyz';
const createNode = (overrides = {}) => ({
  nodeId: 'node-1',
  serviceType: 'AI_INFERENCE_ENGINE',
  endpointUrl: 'https://ai.example.test',
  securityToken: TOKEN,
  ...overrides,
});
describe('RegistryIngressEngine', () => {
  let registry;
  beforeEach(() => {
    registry = new RegistryIngressEngine(2);
  });
  it('registers and retrieves a valid node', () => {
    const node = createNode();
    registry.registerNode(node);
    expect(registry.activeNodeCount).toBe(1);
    expect(registry.getRegisteredNode(node.nodeId)).toEqual(node);
  });

  it('rejects insecure endpoints', () => {
    expect(() =>
      registry.registerNode(createNode({ endpointUrl: 'http://ai.example.test' })),
    ).toThrow(/transport|tls|https/i);
    expect(registry.activeNodeCount).toBe(0);
  });
  it('rejects invalid security tokens', () => {
    ['', 'short-token'].forEach((securityToken) => {
      expect(() =>
        registry.registerNode(createNode({ securityToken })),
      ).toThrow(/security|token|entropy/i);
    });
    expect(registry.activeNodeCount).toBe(0);
  });
  it('enforces capacity', () => {
    registry.registerNode(createNode());
    registry.registerNode(
      createNode({
        nodeId: 'node-2',
        serviceType: 'ECOMMERCE_GATEWAY',
        endpointUrl: 'https://shop.example.test',
      }),
    );

    expect(() =>
      registry.registerNode(
        createNode({
          nodeId: 'node-3',
          serviceType: 'CHAT_STREAM_SOCKET',
          endpointUrl: 'https://chat.example.test',
        }),
      ),
    ).toThrow(/quota|capacity|limit/i);
    expect(registry.activeNodeCount).toBe(2);
  });

  it('updates an existing node without consuming capacity', () => {
    registry.registerNode(createNode());
    registry.registerNode(
      createNode({
        nodeId: 'node-2',
        endpointUrl: 'https://secondary.example.test',
      }),
    );
    registry.registerNode(
      createNode({ endpointUrl: 'https://updated.example.test' }),
    );
    expect(registry.activeNodeCount).toBe(2);
    expect(registry.getRegisteredNode('node-1')?.endpointUrl).toBe(
      'https://updated.example.test',
    );
  });

  it('stores an immutable manifest copy', () => {
    const node = createNode();
    registry.registerNode(node);
    node.endpointUrl = 'https://mutated.example.test';
    const stored = registry.getRegisteredNode(node.nodeId);
    expect(stored).toBeDefined();
    expect(stored.endpointUrl).toBe('https://ai.example.test');
    expect(() => {
      stored.endpointUrl = 'https://hacked.example.test';
    }).toThrow();
  });
  it('returns undefined for unknown nodes', () => {
    expect(registry.getRegisteredNode('missing')).toBeUndefined();
  });

  it('clears all nodes', () => {
    registry.registerNode(createNode());
    registry.registerNode(
      createNode({
        nodeId: 'node-2',
        endpointUrl: 'https://secondary.example.test',
      }),
    );
    registry.clear();

    expect(registry.activeNodeCount).toBe(0);
    expect(registry.getRegisteredNode('node-1')).toBeUndefined();
  });
});
```
