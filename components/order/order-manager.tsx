"use client"

import { useEffect, useMemo, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Clock, Check, Truck } from "lucide-react"

import { Order } from "@/app/types/order"
import { User } from "@/app/types/user"
import { OrderDetailsDialog } from "@/components/order/order-details-dialog"
import { useOrders } from "@/hooks/admin/useOrders"
import { useUsers } from "@/hooks/admin/useUsers"
import { usePathname, useRouter } from "next/navigation"

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

export function OrdersManager() {
    const [filter, setFilter] = useState<"all" | keyof typeof statusConfig>("all")
    const [orders, setOrders] = useState<Order[]>([])
    const [riders, setRiders] = useState<User[]>([])
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
    const [selectedRider, setSelectedRider] = useState<User | null>(null)
    const [isDialogOpen, setIsDialogOpen] = useState(false)

      const pathname = usePathname();
    const router = useRouter();

    const { fetchOrders, updateOrderStatus, loading } = useOrders()
    const { fetchUsers } = useUsers()

    useEffect(() => {
        fetchOrders().then(setOrders)
        fetchUsers({ role: "rider" }).then(res => setRiders(res.data))
    }, [])

    const orderCounts = useMemo(() => ({
        all: orders.length,
        pending: orders.filter(o => o.status === "pending").length,
        confirmed: orders.filter(o => o.status === "confirmed").length,
        otw: orders.filter(o => o.status === "otw").length,
        delivered: orders.filter(o => o.status === "delivered").length,
    }), [orders])

    const filteredOrders = useMemo(() => {
        if (filter === "all") return orders
        return orders.filter(o => o.status === filter)
    }, [orders, filter])

    const handleStatusChange = (orderId: string, newStatus: string) => {
        if (!selectedOrder) return

        setOrders(prev =>
            prev.map(o =>
                o.order_id === orderId ? { ...o, status: newStatus } : o
            )
        )

        setSelectedOrder({ ...selectedOrder, status: newStatus })

        updateOrderStatus({
            order_id: orderId,
            status: newStatus,
            rider_id: selectedRider?.id,
        })

        setIsDialogOpen(false)
    }

    const handleRiderAssign = (order: Order, rider: User) => {
        setSelectedOrder({ ...order, rider })
        setSelectedRider(rider)

        setOrders(prev =>
            prev.map(o =>
                o.order_id === order.order_id ? { ...o, rider } : o
            )
        )
    }

    const handleSaveNotes = (orderId: string, notes: string) => {
        setOrders(prev =>
            prev.map(o =>
                o.order_id === orderId ? { ...o, notes } : o
            )
        )

        if (selectedOrder?.order_id === orderId) {
            setSelectedOrder({ ...selectedOrder, notes })
        }
    }

    return (
        <div>
            <div className="mb-8">
                <h2 className="text-3xl font-bold mb-4">Order Management</h2>

                <div className="flex gap-2 flex-wrap">
                    {["all", ...Object.keys(statusConfig)].map(status => (
                        <Button
                            key={status}
                            variant={filter === status ? "default" : "outline"}
                            onClick={() => setFilter(status as any)}
                            className="capitalize"
                        >
                            {status === "all"
                                ? `All Orders (${orderCounts.all})`
                                : `${statusConfig[status as keyof typeof statusConfig].label}
                   (${orderCounts[status as keyof typeof orderCounts]})`}
                        </Button>
                    ))}
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>
                        {loading
                            ? "Loading orders…"
                            : `${filter === "all"
                                ? "All Orders"
                                : statusConfig[filter].label
                            } (${filteredOrders.length})`}
                    </CardTitle>
                </CardHeader>

                <CardContent>
                    {loading ? (
                        <div className="py-8 text-center text-muted-foreground">
                            Fetching orders…
                        </div>
                    ) : filteredOrders.length === 0 ? (
                        <div className="py-8 text-center text-muted-foreground">
                            No orders found
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {filteredOrders.map(order => {
                                const config = statusConfig[order.status]

                                return (
                                    <div
                                        key={order.order_id}
                                        className="flex items-center justify-between p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition"
                                    >
                                        <div>
                                            <p className="font-semibold">#{order.order_id}</p>
                                            <p className="text-sm text-muted-foreground">
                                                {order.receipient_name} • {order.items.length} item(s)
                                            </p>
                                        </div>

                                        <div className="flex items-center gap-4">
                                            <div className="text-right">
                                                <p className="font-semibold">₱{order.items_total}</p>
                                                <p className="text-xs text-muted-foreground">
                                                    {order.created_at_human}
                                                </p>
                                            </div>

                                            <Badge className={config.color}>
                                                <config.icon className="w-3 h-3 mr-1" />
                                                {config.label}
                                            </Badge>

                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => {
                                                    setSelectedOrder(order)
                                                    if (pathname.includes('/admin')) {
                                                        setIsDialogOpen(true)
                                                    } else {
                                                        router.push(`/checkout/status?orderId=${order.order_id}`)
                                                    }
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