"use client"

import { useState, useCallback } from "react"
import { useApi } from "@/hooks/use-api"
import { toast } from "sonner"

export interface RiderStats {
  active_deliveries: number
  completed_today: number
  earnings_today: number
  pending_pickups: number
  total_deliveries: number
  trend: { label: string; value: number }[]
}

export function useRiderStats() {
  const [loading, setLoading] = useState(false)
  const statsApi = useApi<{ data: RiderStats }>("/ordering/rider/stats")

  const fetchStats = useCallback(async (): Promise<RiderStats> => {
    setLoading(true)
    try {
      const res = await statsApi.callApi({ method: "GET" })
      return res.data
    } catch (err: any) {
      toast.error(err?.message || "Failed to fetch rider stats")
      throw err
    } finally {
      setLoading(false)
    }
  }, [statsApi.callApi])

  return {
    fetchStats,
    loading: loading || statsApi.loading,
  }
}
