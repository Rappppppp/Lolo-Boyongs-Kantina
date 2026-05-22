// hooks/useApi.ts
"use client"

import { useCallback, useEffect, useRef, useState } from "react"
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

  // Track mounted state so we never update state on an unmounted component
  const mountedRef = useRef(true)
  // Keep latest baseEndpoint in a ref so callApi doesn't need it as a dep
  const endpointRef = useRef(baseEndpoint)
  endpointRef.current = baseEndpoint

  // Reset mounted flag on unmount
  useEffect(() => {
    mountedRef.current = true
    return () => {
      mountedRef.current = false
    }
  }, [])

  // callApi is stable across renders — safe to use as a useCallback dependency
  const callApi = useCallback(async <R = T>(options: CallApiOptions = {}): Promise<R> => {
    const { method = "GET", body, token, urlOverride, isFormData } = options

    if (mountedRef.current) setLoading(true)
    if (mountedRef.current) setError(null)

    try {
      const response = await apiFetch<R>(urlOverride ?? endpointRef.current, {
        method,
        body,
        token,
        isFormData,
      })

      if (mountedRef.current) setData(response as unknown as T)
      return response
    } catch (err) {
      // Backend throws plain objects; extract message if available
      const message =
        err instanceof Error
          ? err.message
          : typeof err === "object" && err !== null && "message" in err
          ? String((err as Record<string, unknown>).message)
          : "An unexpected error occurred"

      if (mountedRef.current) setError(message)
      throw err
    } finally {
      if (mountedRef.current) setLoading(false)
    }
  }, []) // stable — reads endpoint from ref, state setters are always stable

  return {
    data,
    loading,
    error,
    callApi,
  }
}