"use client"

import { useEffect, useMemo, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Truck, CheckCircle, Loader2, LogOut } from "lucide-react"
import { useOrders } from "@/hooks/rider/useOrders"
import { Order } from "@/app/types/order"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import LogoutModal from "@/components/auth/logout-modal"

const statusConfig = {
    otw: { label: "On the Way", icon: Truck, color: "bg-blue-100 text-blue-800" },
    completed: { label: "Completed", icon: CheckCircle, color: "bg-green-100 text-green-800" },
}

export default function RiderPage() {
    const [orders, setOrders] = useState<Order[]>([])
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false)
    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false)
    const { fetchOrders, updateOrderStatus, loading } = useOrders()

    useEffect(() => {
        fetchOrders().then
            (setOrders).catch(() => { })
    }, [])
    // Separate delivered/completed orders
    const completedOrders = useMemo(() => {
        return orders.filter(
            order => order.status === "completed" || order.status === "delivered"
        )
    }, [orders])

    // Orders that are not completed/delivered (everything else)
    const activeOrders = useMemo(() => {
        return orders.filter(
            order => order.status !== "completed" && order.status !== "delivered"
        )
    }, [orders])

    const handleDeliverClick = (order: Order) => {
        setSelectedOrder(order)
        setIsConfirmModalOpen(true)
    }

    const handleConfirmDelivery = () => {
        if (selectedOrder) {
            setOrders(orders.map(order =>
                order.order_id === selectedOrder.order_id
                    ? { ...order, status: "completed" }
                    : order
            ))
            setIsConfirmModalOpen(false)
            setIsSuccessModalOpen(false)
            setSelectedOrder(null)
           updateOrderStatus({ order_id: selectedOrder.order_id, status: "delivered" })
        }
    }

    return (
        <div className="space-y-8 p-12">
            {/* Header */}
            <div className="flex gap-2">
                <LogoutModal>
                    <Button
                        variant="ghost"
                        size="icon"
                        disabled={loading}
                    >
                        {loading ? <Loader2 className="w-12 h-12 animate-spin" /> : <LogOut className="w-5 h-5" />}
                    </Button>
                </LogoutModal>

                <div>
                    <h1 className="text-4xl font-bold text-foreground mb-2">
                    Rider Dashboard
                </h1>
                <p className="text-muted-foreground">
                    Manage your deliveries and mark orders as completed
                </p>
                </div>
            </div>

            {/* OTW Orders */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Truck className="w-5 h-5 text-blue-600" />
                        Orders for Delivery ({activeOrders.length})
                    </CardTitle>
                </CardHeader>

                <CardContent>
                    {loading ? (
                        <div className="text-center text-muted-foreground py-8">
                            Loading orders…
                        </div>
                    ) : activeOrders.length === 0 ? (
                        <div className="text-center text-muted-foreground py-8">
                            No orders to deliver
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {activeOrders.map(order => (
                                <div
                                    key={order.order_id}
                                    className="flex items-center justify-between p-4 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition"
                                >
                                    <div className="flex-1">
                                        <p className="font-bold text-foreground">
                                            #{order.order_id}
                                        </p>
                                        <p className="text-sm text-muted-foreground mb-2">
                                            {order.receipient_name}
                                        </p>
                                        <p className="text-sm text-foreground">
                                            {order.address}
                                        </p>
                                    </div>

                                    <div className="flex items-center gap-4">
                                        <div className="text-right">
                                            <p className="font-semibold text-foreground">
                                                ₱{order.items_total}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                {order.items.length} item(s)
                                            </p>
                                        </div>

                                        <Badge className={statusConfig.otw?.color}>
                                            {statusConfig.otw?.icon && (
                                                <statusConfig.otw.icon className="w-3 h-3 mr-1" />
                                            )}
                                            {statusConfig.otw?.label}
                                        </Badge>

                                        <Button
                                            onClick={() => handleDeliverClick(order)}
                                            className="bg-green-600 hover:bg-green-700 text-white"
                                            size="sm"
                                        >
                                            Confirm Delivery
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Completed Orders */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        Completed Deliveries ({completedOrders.length})
                    </CardTitle>
                </CardHeader>

                <CardContent>
                    {completedOrders.length === 0 ? (
                        <div className="text-center text-muted-foreground py-8">
                            No completed deliveries yet
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {completedOrders.map(order => (
                                <div
                                    key={order.order_id}
                                    className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg opacity-75"
                                >
                                    <div className="flex-1">
                                        <p className="font-semibold text-foreground">
                                            #{order.order_id}
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            {order.receipient_name}
                                        </p>
                                    </div>

                                    <div className="flex items-center gap-4">
                                        <p className="text-sm font-semibold text-foreground">
                                            ₱{order.items_total}
                                        </p>

                                        <Badge className={statusConfig.completed?.color}>
                                            {statusConfig.completed?.icon && (
                                                <statusConfig.completed.icon className="w-3 h-3 mr-1" />
                                            )}
                                            {statusConfig.completed?.label}
                                        </Badge>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Confirm Delivery Modal */}
            <Dialog open={isConfirmModalOpen} onOpenChange={setIsConfirmModalOpen}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>Confirm Delivery</DialogTitle>
                        <DialogDescription>
                            Mark order as delivered?
                        </DialogDescription>
                    </DialogHeader>

                    {selectedOrder && (
                        <div className="space-y-4">
                            {/* Order Details */}
                            <div className="bg-muted/30 p-4 rounded-lg space-y-2">
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Order ID:</span>
                                    <span className="font-semibold">#{selectedOrder.order_id}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Recipient:</span>
                                    <span className="font-semibold">{selectedOrder.receipient_name}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Address:</span>
                                    <span className="font-semibold text-right">{selectedOrder.address}</span>
                                </div>
                                <div className="flex justify-between pt-2 border-t border-border">
                                    <span className="text-muted-foreground">Total:</span>
                                    <span className="font-bold text-lg">₱{selectedOrder.items_total}</span>
                                </div>
                            </div>

                            {/* Items List */}
                            <div>
                                <p className="text-sm font-semibold text-muted-foreground mb-2">
                                    Items:
                                </p>
                                <div className="space-y-1 text-sm">
                                    {selectedOrder.items.map((item, idx) => (
                                        <div key={idx} className="flex justify-between">
                                            <span>{item.menu_item_name} × {item.quantity}</span>
                                            <span className="text-muted-foreground">₱{item.price}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-3 pt-4 border-t border-border">
                                <Button
                                    variant="outline"
                                    onClick={() => setIsConfirmModalOpen(false)}
                                    className="flex-1"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    onClick={handleConfirmDelivery}
                                    className="flex-1 bg-green-600 hover:bg-green-700"
                                >
                                    Confirm Delivery
                                </Button>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            {/* Success Modal */}
            <Dialog open={isSuccessModalOpen} onOpenChange={setIsSuccessModalOpen}>
                <DialogContent className="max-w-sm">
                    <DialogHeader>
                        <DialogTitle>Delivery Completed</DialogTitle>
                    </DialogHeader>

                    <div className="flex flex-col items-center justify-center py-8">
                        <CheckCircle className="w-16 h-16 text-green-600 mb-4" />
                        <p className="text-center text-foreground font-semibold mb-2">
                            Order #{selectedOrder?.order_id} marked as delivered
                        </p>
                        <p className="text-center text-sm text-muted-foreground">
                            Great job! Order has been successfully delivered.
                        </p>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}
