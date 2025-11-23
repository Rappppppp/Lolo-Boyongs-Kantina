"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Clock, Check, Truck } from "lucide-react"

const orders = [
  { id: "ORD-001", customer: "John Doe", items: 3, status: "preparing", total: 45.99, time: "2 mins ago" },
  { id: "ORD-002", customer: "Jane Smith", items: 2, status: "ready", total: 32.5, time: "5 mins ago" },
  { id: "ORD-003", customer: "Bob Wilson", items: 5, status: "delivered", total: 78.99, time: "15 mins ago" },
  { id: "ORD-004", customer: "Alice Brown", items: 2, status: "preparing", total: 28.99, time: "1 min ago" },
  { id: "ORD-005", customer: "Charlie Davis", items: 4, status: "ready", total: 65.49, time: "8 mins ago" },
]

const statusConfig = {
  preparing: { label: "Preparing", icon: Clock, color: "bg-amber-100 text-amber-800" },
  ready: { label: "Ready", icon: Check, color: "bg-green-100 text-green-800" },
  delivered: { label: "Delivered", icon: Truck, color: "bg-blue-100 text-blue-800" },
}

export default function OrdersPage() {
  const [filter, setFilter] = useState("all")

  const filteredOrders = filter === "all" ? orders : orders.filter((o) => o.status === filter)

  return (
    <div className="p-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-foreground mb-4">Order Management</h2>

        <div className="flex gap-2">
          {["all", "preparing", "ready", "delivered"].map((status) => (
            <Button
              key={status}
              variant={filter === status ? "default" : "outline"}
              onClick={() => setFilter(status)}
              className="capitalize"
            >
              {status === "all" ? "All Orders" : statusConfig[status as keyof typeof statusConfig].label}
            </Button>
          ))}
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Active Orders ({filteredOrders.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {filteredOrders.map((order) => {
              const config = statusConfig[order.status as keyof typeof statusConfig]
              return (
                <div
                  key={order.id}
                  className="flex items-center justify-between p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div>
                      <p className="font-semibold text-foreground">{order.id}</p>
                      <p className="text-sm text-muted-foreground">
                        {order.customer} • {order.items} items
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="font-semibold text-foreground">${order.total}</p>
                      <p className="text-xs text-muted-foreground">{order.time}</p>
                    </div>

                    <Badge className={config.color}>
                      <config.icon className="w-3 h-3 mr-1" />
                      {config.label}
                    </Badge>

                    <Button size="sm" variant="outline">
                      View
                    </Button>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
