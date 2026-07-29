const TELEMETRY_ENDPOINT =
  import.meta.env.VITE_TELEMETRY_URL ?? "/api/telemetry";

const SESSION_ID = crypto.randomUUID();
const QUEUE_LIMIT = 20;
const queue = [];
const sanitize = (payload = {}) =>
  Object.fromEntries(
    Object.entries(payload).filter(
      ([key, value]) =>
        !["password", "token", "authorization"].includes(key.toLowerCase()) &&
        value !== undefined
    )
  );

const sendBatch = async () => {
  if (!queue.length) return;
  const events = queue.splice(0, QUEUE_LIMIT);
  const body = JSON.stringify({ sessionId: SESSION_ID, events });

  try {
    const response = await fetch(TELEMETRY_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
      keepalive: true,
    });
    if (!response.ok) throw new Error(`Telemetry failed: ${response.status}`);
  } catch {
    queue.unshift(...events);
  }
};

const track = (name, payload = {}) => {
  if (!name || typeof name !== "string") return;
  queue.push({
    id: crypto.randomUUID(),
    name,
    payload: sanitize(payload),
    timestamp: new Date().toISOString(),
  });
  if (queue.length >= QUEUE_LIMIT) void sendBatch();
};
window.addEventListener("pagehide", () => void sendBatch());
const TelemetryEngine = Object.freeze({ track, flush: sendBatch });

export default TelemetryEngine;
