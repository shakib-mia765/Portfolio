const ENDPOINT =
  import.meta.env.VITE_EDGE_TELEMETRY_URL ?? "/api/telemetry/edge-cache";

const QUEUE_LIMIT = 10;
const queue = [];
const normalizeMetric = (name, details = {}) => ({
  id: crypto.randomUUID(),
  name,
  timestamp: Date.now(),
  route: globalThis.location?.pathname ?? "/",
  cacheStatus: details.cacheStatus ?? "unknown",
  latencyMs: Math.max(0, Number(details.latencyMs) || 0),
  region: details.region ?? "unknown",
});

const flush = async () => {
  if (!queue.length) return true;
  const metrics = queue.splice(0, QUEUE_LIMIT);
  try {
    const response = await fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ metrics }),
      keepalive: true,
    });
    if (!response.ok) throw new Error(`Telemetry failed: ${response.status}`);
    return true;
  } catch {
    queue.unshift(...metrics);
    return false;
  }
};

const track = (name, details) => {
  if (typeof name !== "string" || !name.trim()) return false;
  queue.push(normalizeMetric(name.trim(), details));
  if (queue.length >= QUEUE_LIMIT) void flush();
  return true;
};
globalThis.addEventListener?.("pagehide", flush);
const EdgeCacheTelemetry = Object.freeze({
  track,
  flush,
  size: () => queue.length,
});

export default EdgeCacheTelemetry;
