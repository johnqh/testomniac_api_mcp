/**
 * HTTP client for the Testomniac API.
 *
 * Auth mirrors `firebaseAuthMiddleware` in testomniac_api, which accepts, in
 * order: an entity API key (`tst_`-prefixed, via `X-Api-Key`/`X-Scanner-Key`),
 * the global scanner key (`SCANNER_API_KEY`, same headers, un-prefixed), or a
 * Firebase `Bearer` token. Sending both a key and a token is fine — the key
 * wins.
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

/**
 * Builds a `?a=1&b=2` suffix, dropping undefined/null/empty values.
 * Returns "" when nothing survives, so callers can append it unconditionally.
 */
export function query(params: Record<string, unknown>): string {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null || value === "") continue;
    search.set(key, String(value));
  }
  const encoded = search.toString();
  return encoded ? `?${encoded}` : "";
}

async function request<T>(
  method: string,
  path: string,
  body?: unknown
): Promise<T> {
  const res = await fetch(`${baseUrl()}${path}`, {
    method,
    headers: getHeaders(),
    body: body === undefined ? undefined : JSON.stringify(body),
  });

  let json: ApiResponse<T>;
  try {
    json = (await res.json()) as ApiResponse<T>;
  } catch {
    throw new Error(`API error: ${res.status} ${res.statusText}`);
  }

  if (!res.ok || !json.success) {
    throw new Error(json.error || `API error: ${res.status} ${res.statusText}`);
  }

  return json.data as T;
}

export function get<T = unknown>(path: string): Promise<T> {
  return request<T>("GET", path);
}

export function post<T = unknown>(path: string, body?: unknown): Promise<T> {
  return request<T>("POST", path, body);
}

export function put<T = unknown>(path: string, body?: unknown): Promise<T> {
  return request<T>("PUT", path, body);
}

export function del<T = unknown>(path: string): Promise<T> {
  return request<T>("DELETE", path);
}
