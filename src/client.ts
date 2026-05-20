/**
 * HTTP client for the Testomniac API.
 * Handles auth (Bearer token or X-Scanner-Key) and error formatting.
 */

interface ClientConfig {
  apiUrl: string;
  authToken?: string;
  apiKey?: string;
}

interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

let config: ClientConfig | null = null;

export function configure(cfg: ClientConfig) {
  config = cfg;
}

function getHeaders(): Record<string, string> {
  if (!config) throw new Error("Client not configured. Call configure() first.");

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (config.authToken) {
    headers["Authorization"] = `Bearer ${config.authToken}`;
  }
  if (config.apiKey) {
    headers["X-Scanner-Key"] = config.apiKey;
  }

  return headers;
}

function baseUrl(): string {
  if (!config) throw new Error("Client not configured.");
  return config.apiUrl.replace(/\/$/, "");
}

export async function get<T = unknown>(path: string): Promise<T> {
  const res = await fetch(`${baseUrl()}${path}`, {
    method: "GET",
    headers: getHeaders(),
  });

  const json = (await res.json()) as ApiResponse<T>;

  if (!res.ok || !json.success) {
    throw new Error(json.error || `API error: ${res.status} ${res.statusText}`);
  }

  return json.data as T;
}

export async function post<T = unknown>(path: string, body?: unknown): Promise<T> {
  const res = await fetch(`${baseUrl()}${path}`, {
    method: "POST",
    headers: getHeaders(),
    body: body ? JSON.stringify(body) : undefined,
  });

  const json = (await res.json()) as ApiResponse<T>;

  if (!res.ok || !json.success) {
    throw new Error(json.error || `API error: ${res.status} ${res.statusText}`);
  }

  return json.data as T;
}

export async function del<T = unknown>(path: string): Promise<T> {
  const res = await fetch(`${baseUrl()}${path}`, {
    method: "DELETE",
    headers: getHeaders(),
  });

  const json = (await res.json()) as ApiResponse<T>;

  if (!res.ok || !json.success) {
    throw new Error(json.error || `API error: ${res.status} ${res.statusText}`);
  }

  return json.data as T;
}
