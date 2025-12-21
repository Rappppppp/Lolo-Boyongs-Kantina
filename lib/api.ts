import Cookies from "js-cookie";
import { appConfig } from "@/config/app.config";

export type HTTPMethod = "GET" | "POST" | "PUT" | "DELETE";

interface RequestOptions {
  method?: HTTPMethod;
  body?: any;
  token?: string; // optional override
  urlOverride?: string; // optional override
  isFormData?: boolean; // for file upload
}

export async function apiFetch<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { method = "GET", body, token, urlOverride, isFormData } = options;

  // Use provided token or get from cookie
  const authToken = token || Cookies.get("token");

  const headers: Record<string, string> = {
    "Accept": "application/json",
    ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
  };
  if (!isFormData) {
    headers["Content-Type"] = "application/json";
  }

  const res = await fetch(`${appConfig.urls.apiUrl}${urlOverride || endpoint}`, {
    method,
    headers,
    body: isFormData ? body : body ? JSON.stringify(body) : undefined,
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw data; // return full server error
  }

  return data as T;
}
