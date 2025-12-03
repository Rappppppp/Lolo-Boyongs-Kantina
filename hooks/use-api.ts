// hooks/useApi.ts
import { useState } from "react";
import { apiFetch } from "@/lib/api";

export function useApi<T = any>(endpoint: string, method: "GET" | "POST" | "PUT" | "DELETE" = "GET") {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const callApi = async (body?: any, token?: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiFetch<T>(endpoint, { method, body, token });
      setData(response);
      return response;
    } catch (err: any) {
      setError(err.message || "Unknown error");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, callApi };
}
