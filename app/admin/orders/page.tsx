"use client"

import { useEffect, useMemo, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Clock, Check, Truck, X, Users, Edit2 } from "lucide-react"
import { useOrders } from "@/hooks/admin/useOrders"
import { Order, Rider } from "@/app/types/order"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useUsers } from "@/hooks/admin/useUsers"
import { OrderDetailsDialog } from "@/components/order/order-details-dialog"

const statusConfig = {
  pending: { label: "Pending", icon: Clock, color: "bg-gray-100 text-gray-800" },
  confirmed: { label: "Confirmed", icon: Check, color: "bg-green-100 text-green-800" },
  otw: { label: "On the Way", icon: Truck, color: "bg-blue-100 text-blue-800" },
  delivered: { label: "Completed", icon: Check, color: "bg-green-100 text-green-800" },
}

const statusFlow = {
  pending: "confirmed",
  confirmed: "otw",
  otw: "delivered",
  delivered: null,
}

export default function OrdersPage() {
  const [filter, setFilter] = useState<"all" | keyof typeof statusConfig>("all")
  const [orders, setOrders] = useState<Order[]>([])
  const [riders, setRiders] = useState<Rider[]>([])
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [selectedRider, setSelectedRider] = useState<Rider | null>(null)

  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const { fetchUsers } = useUsers()
  const { fetchOrders, updateOrderStatus, loading } = useOrders()

  // 🔒 Fetch ONCE on mount
  useEffect(() => {
    fetchOrders().then(setOrders).catch(() => { })
    fetchUsers('rider').then(setRiders).catch(() => { })
  }, [])

  const handleStatusChange = (orderId: string, newStatus: string) => {
    console.log(selectedRider)

    if (selectedOrder && selectedOrder.order_id === orderId) {
      setOrders(orders.map(order =>
        order.order_id === orderId ? { ...order, status: newStatus } : order
      ))
      setSelectedOrder({ ...selectedOrder, status: newStatus })
      updateOrderStatus({ order_id: orderId, status: newStatus, rider_id: selectedRider?.id })
      setIsDialogOpen(false)
    }
  }

  const handleRiderAssign = (order: Order, rider: Rider) => {
    setSelectedOrder({ ...order, rider })

    setOrders(prev =>
      prev.map(o =>
        o.order_id === order.order_id ? { ...o, rider } : o
      )
    )

    setSelectedRider(rider)
  }


  const handleSaveNotes = (orderId: string, notes: string) => {
    setOrders(prev =>
      prev.map(order =>
        order.order_id === orderId ? { ...order, notes } : order
      )
    )

    if (selectedOrder?.order_id === orderId) {
      setSelectedOrder({ ...selectedOrder, notes })
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
                          setIsDialogOpen(true)
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
      <OrderDetailsDialog
        isDialogOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        selectedOrder={selectedOrder}
        riders={riders}
        statusConfig={statusConfig}
        statusFlow={statusFlow}
        onStatusChange={handleStatusChange}
        onSaveNotes={handleSaveNotes}
        onRiderAssign={handleRiderAssign}
      />
    </div>
  )
}
