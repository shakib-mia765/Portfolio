const API_CONFIG = Object.freeze({
  baseURL: import.meta.env.VITE_API_URL ?? "/api",
  timeout: 10_000,
  headers: Object.freeze({ Accept: "application/json" }),
});

const createError = async (response) => {
  const payload = await response.json().catch(() => ({}));
  const error = new Error(payload.message ?? `Request failed: ${response.status}`);
  error.status = response.status;
  error.details = payload;
  return error;
};
const request = async (path, options = {}) => {
  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), API_CONFIG.timeout);
  try {
    const response = await fetch(`${API_CONFIG.baseURL}${path}`, {
      ...options,
      signal: controller.signal,
      headers: {
        ...API_CONFIG.headers,
        ...(options.body ? { "Content-Type": "application/json" } : {}),
        ...options.headers,
      },
    });
    if (!response.ok) throw await createError(response);
    if (response.status === 204) return null;
    return await response.json();
  } catch (error) {
    if (error.name === "AbortError") throw new Error("Request timed out.");
    throw error;
  } finally {
    window.clearTimeout(timeoutId);
  }
};

export const server = Object.freeze({
  get: (path, options) => request(path, { ...options, method: "GET" }),
  post: (path, body, options) =>
    request(path, { ...options, method: "POST", body: JSON.stringify(body) }),
});
