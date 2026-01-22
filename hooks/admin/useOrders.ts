"use client"

import { useState, useCallback } from "react"
import { useApi } from "@/hooks/use-api"
import { useToast } from "@/components/ui/use-toast"
import { Order } from "@/app/types/order"

interface UpdateStatusPayload {
  order_id: string
  status: string
}

export function useOrders() {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)

  // GET /admin/order
  const listApi = useApi<{ data: Order[] }>("/admin/order", "GET")

  // PUT /admin/order/update
  const updateApi = useApi<{
    message: string
    status?: string
  }>("/admin/order/update", "PUT")

  // ✅ Fetch orders
  const fetchOrders = useCallback(async () => {
    setLoading(true)
    try {
      const res = await listApi.callApi()
      return res.data
    } catch (err: any) {
      toast({
        title: "Failed to fetch orders",
        description: err?.message ?? "Unknown error",
        variant: "destructive",
      })
      throw err
    } finally {
      setLoading(false)
    }
  }, [listApi.callApi, toast])

  // ✅ Update order status (idempotent-safe)
  const updateOrderStatus = useCallback(
    async (payload: UpdateStatusPayload) => {
      try {
        const res = await updateApi.callApi({
          body: payload,
        })
        return res
      } catch (err: any) {
        toast({
          title: "Failed to update order status",
          description: err?.message ?? "Unknown error",
          variant: "destructive",
        })
        throw err
      }
    },
    [updateApi.callApi, toast]
  )

  return {
    fetchOrders,
    updateOrderStatus,
    loading: loading || listApi.loading || updateApi.loading,
  }
}
