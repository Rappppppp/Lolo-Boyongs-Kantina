"use client"

import { useState, useCallback } from "react"
import { useApi } from "@/hooks/use-api"
// import { useToast } from "@/components/ui/use-toast"
import { Order } from "@/app/types/order"

import { toast } from "sonner"

interface UpdateStatusPayload {
  order_id: string
  status: string
  rider_id?: number
}

export function useOrders() {
  const [loading, setLoading] = useState(false)

  // GET /admin/order
  const listApi = useApi<{ data: Order[] }>("/ordering/get-orders") //("/admin/order")

  // PUT /admin/order/update
  const updateApi = useApi<{
    message: string
    status?: string
    rider_id?: number
  }>("/admin/order/update")

  // ✅ Fetch orders
  const fetchOrders = useCallback(async () => {
    setLoading(true)
    try {
      const res = await listApi.callApi()
      return res.data
    } catch (err: any) {
      console.error(err.message || "Failed to fetch order")
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
          method: "PUT",
          body: payload,
        })
        toast.success(`Successfully updated order status to ${payload.status.toUpperCase()}`)
        return res
      } catch (err: any) {
        toast.error(err?.message || "Failed to update order status")
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
