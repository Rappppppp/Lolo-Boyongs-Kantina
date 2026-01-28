// hooks/useApi.ts
"use client"

import { useState } from "react"
import { apiFetch } from "@/lib/api"

export type HttpMethod = "GET" | "POST" | "PUT" | "DELETE"

interface CallApiOptions {
  method?: HttpMethod
  body?: unknown
  token?: string
  urlOverride?: string
  isFormData?: boolean
}

export function useApi<T = unknown>(baseEndpoint: string) {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const callApi = async <R = T>({
    method = "GET",
    body,
    token,
    urlOverride,
    isFormData,
  }: CallApiOptions = {}): Promise<R> => {
    setLoading(true)
    setError(null)

    try {
      const response = await apiFetch<R>(urlOverride ?? baseEndpoint, {
        method,
        body,
        token,
        isFormData,
      })

      setData(response as unknown as T)
      return response
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Unknown error"

      setError(message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  return {
    data,
    loading,
    error,
    callApi,
  }
}