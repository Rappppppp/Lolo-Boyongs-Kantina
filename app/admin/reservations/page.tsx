"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, User } from "lucide-react"

const reservations = [
  {
    id: "RES-001",
    name: "John Doe",
    date: "2024-12-25",
    time: "19:00",
    guests: 4,
    phone: "+1-555-0123",
    status: "confirmed",
  },
  {
    id: "RES-002",
    name: "Jane Smith",
    date: "2024-12-25",
    time: "20:00",
    guests: 2,
    phone: "+1-555-0124",
    status: "confirmed",
  },
  {
    id: "RES-003",
    name: "Bob Wilson",
    date: "2024-12-26",
    time: "18:30",
    guests: 6,
    phone: "+1-555-0125",
    status: "pending",
  },
  {
    id: "RES-004",
    name: "Alice Brown",
    date: "2024-12-26",
    time: "19:30",
    guests: 3,
    phone: "+1-555-0126",
    status: "confirmed",
  },
]

const statusColors = {
  confirmed: "bg-green-100 text-green-800",
  pending: "bg-amber-100 text-amber-800",
  cancelled: "bg-red-100 text-red-800",
}

export default function ReservationsAdminPage() {
  const [filter, setFilter] = useState("all")

  const filteredReservations = filter === "all" ? reservations : reservations.filter((r) => r.status === filter)

  return (
    <div className="p-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-foreground mb-4">Reservations</h2>

        <div className="flex gap-2">
          {["all", "confirmed", "pending", "cancelled"].map((status) => (
            <Button
              key={status}
              variant={filter === status ? "default" : "outline"}
              onClick={() => setFilter(status)}
              className="capitalize"
            >
              {status === "all" ? "All" : status}
            </Button>
          ))}
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Reservations ({filteredReservations.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {filteredReservations.map((res) => (
              <div
                key={res.id}
                className="flex items-center justify-between p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition"
              >
                <div className="flex items-center gap-4 flex-1">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                    <User className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-foreground">{res.name}</p>
                    <div className="flex gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {res.date} at {res.time}
                      </span>
                      <span>{res.guests} guests</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <a href={`tel:${res.phone}`} className="text-primary hover:underline text-sm">
                    {res.phone}
                  </a>
                  <Badge className={statusColors[res.status as keyof typeof statusColors]}>{res.status}</Badge>
                  <Button size="sm" variant="outline">
                    Details
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
