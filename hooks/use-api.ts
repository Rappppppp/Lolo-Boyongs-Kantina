// hooks/useApi.ts
"use client";

import { useState } from "react";
import { apiFetch } from "@/lib/api";

interface CallApiOptions {
  body?: any;
  token?: string;
  urlOverride?: string;
  isFormData?: boolean;
}

export function useApi<T = any>(
  endpoint: string,
  method: "GET" | "POST" | "PUT" | "DELETE" = "GET"
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const callApi = async (options: CallApiOptions = {}) => {
    const { body, token, urlOverride } = options;
    setLoading(true);
    setError(null);

    try {
      const response = await apiFetch<T>(endpoint, { method, body, token, urlOverride });
      setData(response);
      return response;
    } catch (err: unknown) {
      // err might not have a 'message', so safely extract it
      const msg = err && typeof err === "object" && "message" in err ? (err as any).message : "Unknown error";
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, callApi };
}
