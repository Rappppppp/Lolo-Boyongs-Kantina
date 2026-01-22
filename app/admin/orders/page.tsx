"use client"

import { useEffect, useMemo, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Clock, Check, Truck, X } from "lucide-react"
import { useOrders } from "@/hooks/admin/useOrders"
import { Order } from "@/app/types/order"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

const statusConfig = {
  pending: { label: "Pending", icon: Clock, color: "bg-gray-100 text-gray-800" },
  confirmed: { label: "Confirmed", icon: Check, color: "bg-green-100 text-green-800" },
  otw: { label: "On the Way", icon: Truck, color: "bg-blue-100 text-blue-800" },
  delivered: { label: "Delivered", icon: Check, color: "bg-green-100 text-green-800" },
}

const statusFlow = {
  pending: "confirmed",
  confirmed: "otw",
  otw: "delivered",
  delivered: null,
}

const getNextButtonLabel = (status: string) => {
  const labels: { [key: string]: string } = {
    pending: "Mark Confirmed",
    confirmed: "Start Delivery",
    otw: "Mark Completed",
  }
  return labels[status] || null
}

export default function OrdersPage() {
  const [filter, setFilter] = useState<"all" | keyof typeof statusConfig>("all")
  const [orders, setOrders] = useState<Order[]>([])
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { fetchOrders, updateOrderStatus, loading } = useOrders()

  // 🔒 Fetch ONCE on mount
  useEffect(() => {
    fetchOrders().then(setOrders).catch(() => {})
  }, [])

  const handleStatusChange = (orderId: string, newStatus: string) => {
    setOrders(orders.map(order =>
      order.order_id === orderId ? { ...order, status: newStatus } : order
    ))
    if (selectedOrder && selectedOrder.order_id === orderId) {
      setSelectedOrder({ ...selectedOrder, status: newStatus })
      updateOrderStatus({ order_id: orderId, status: newStatus })
    }
  }

  const filteredOrders = useMemo(() => {
    if (filter === "all") return orders
    return orders.filter(order => order.status === filter)
  }, [orders, filter])

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-foreground mb-4">
          Order Management
        </h2>

        <div className="flex gap-2 flex-wrap">
          {["all", ...Object.keys(statusConfig)].map(status => (
            <Button
              key={status}
              variant={filter === status ? "default" : "outline"}
              onClick={() => setFilter(status as any)}
              className="capitalize"
            >
              {status === "all"
                ? "All Orders"
                : statusConfig[status as keyof typeof statusConfig].label}
            </Button>
          ))}
        </div>
      </div>

      {/* Orders Card */}
      <Card>
        <CardHeader>
          <CardTitle>
            {loading ? "Loading orders…" : `Orders (${filteredOrders.length})`}
          </CardTitle>
        </CardHeader>

        <CardContent>
          {loading ? (
            <div className="text-center text-muted-foreground py-8">
              Fetching orders…
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              No orders found
            </div>
          ) : (
            <div className="space-y-3">
              {filteredOrders.map(order => {
                const config =
                  statusConfig[order.status as keyof typeof statusConfig]

                return (
                  <div
                    key={order.order_id}
                    className="flex items-center justify-between p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition"
                  >
                    {/* Left */}
                    <div>
                      <p className="font-semibold text-foreground">
                        #{order.order_id}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {order.receipient_name} • {order.items.length} item(s)
                      </p>
                    </div>

                    {/* Right */}
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="font-semibold text-foreground">
                          ₱{order.items_total}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {order.created_at_human}
                        </p>
                      </div>

                      <Badge className={config?.color}>
                        {config?.icon && (
                          <config.icon className="w-3 h-3 mr-1" />
                        )}
                        {config?.label ?? order.status}
                      </Badge>

                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setSelectedOrder(order)
                          setIsModalOpen(true)
                        }}
                      >
                        View
                      </Button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Order Details Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Order #{selectedOrder?.order_id}</DialogTitle>
          </DialogHeader>

          {selectedOrder && (
            <div className="space-y-6">
              {/* Order Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Recipient</p>
                  <p className="font-semibold">{selectedOrder.receipient_name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-semibold">{selectedOrder.email}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Address</p>
                  <p className="font-semibold">{selectedOrder.address}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Order Date</p>
                  <p className="font-semibold">{selectedOrder.created_at_human}</p>
                </div>
              </div>

              {/* Items */}
              <div>
                <p className="text-sm font-semibold text-muted-foreground mb-3">
                  Items
                </p>
                <div className="space-y-2 bg-muted/30 p-3 rounded-lg">
                  {selectedOrder.items.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex justify-between items-center text-sm"
                    >
                      <span>{item.menu_item_name}</span>
                      <span className="text-muted-foreground">
                        ₱{item.price} × {item.quantity}
                      </span>
                    </div>
                  ))}
                  <div className="border-t border-border pt-2 mt-2 flex justify-between font-semibold">
                    <span>Total</span>
                    <span>₱{selectedOrder.items_total}</span>
                  </div>
                </div>
              </div>

              {/* Status */}
              <div>
                <p className="text-sm font-semibold text-muted-foreground mb-3">
                  Current Status
                </p>
                <Badge
                  className={
                    statusConfig[
                      selectedOrder.status as keyof typeof statusConfig
                    ]?.color
                  }
                >
                  {statusConfig[selectedOrder.status as keyof typeof statusConfig]
                    ?.label || selectedOrder.status}
                </Badge>
              </div>

              {/* Notes */}
              {selectedOrder.notes && (
                <div>
                  <p className="text-sm font-semibold text-muted-foreground mb-2">
                    Notes
                  </p>
                  <p className="text-sm bg-muted/30 p-3 rounded-lg">
                    {selectedOrder.notes}
                  </p>
                </div>
              )}

              {/* Action Button */}
              <div className="flex justify-end gap-3 pt-4 border-t border-border">
                <Button
                  variant="outline"
                  onClick={() => setIsModalOpen(false)}
                  size="sm"
                >
                  Close
                </Button>
                {statusFlow[selectedOrder.status as keyof typeof statusFlow] && (
                  <Button
                    onClick={() => {
                      const nextStatus =
                        statusFlow[
                          selectedOrder.status as keyof typeof statusFlow
                        ]
                      if (nextStatus) {
                        handleStatusChange(selectedOrder.order_id, nextStatus)
                      }
                    }}
                    size="sm"
                  >
                    {getNextButtonLabel(selectedOrder.status)}
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
