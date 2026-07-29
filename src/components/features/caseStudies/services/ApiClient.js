const API_URL = import.meta.env.VITE_API_URL ?? "https://api.example.com";

const DEFAULT_HEADERS = Object.freeze({
  Accept: "application/json",
  "Content-Type": "application/json",
});

const parseResponse = async (response) => {
  const contentType = response.headers.get("content-type");
  const data = contentType?.includes("application/json")
    ? await response.json()
    : await response.text();
  if (!response.ok) {
    const error = new Error(data?.message ?? `Request failed: ${response.status}`);
    error.status = response.status;
    error.details = data;
    throw error;
  }
  return data;
};

const request = async (endpoint, options = {}) => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10_000);
  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers: { ...DEFAULT_HEADERS, ...options.headers },
      body: options.body ? JSON.stringify(options.body) : undefined,
      signal: options.signal ?? controller.signal,
    });
    return await parseResponse(response);
  } finally {
    clearTimeout(timeout);
  }
};

const ApiClient = Object.freeze({
  get: (endpoint, options) => request(endpoint, options),
  post: (endpoint, body, options = {}) =>
    request(endpoint, { ...options, method: "POST", body }),
  put: (endpoint, body, options = {}) =>
    request(endpoint, { ...options, method: "PUT", body }),
  patch: (endpoint, body, options = {}) =>
    request(endpoint, { ...options, method: "PATCH", body }),
  delete: (endpoint, options = {}) =>
    request(endpoint, { ...options, method: "DELETE" }),
});

export default ApiClient;
