"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, User } from "lucide-react"
import { ReservationDetailsDialog } from "@/components/reservations/reservation-dialog"
import { Reservation } from "@/app/types/reservations"
import { useReservation } from "@/hooks/client/useReservation"
import { Dialog, DialogTitle, DialogDescription, DialogContent, DialogFooter } from "@/components/ui/dialog"

const statusColors = {
  confirmed: "bg-green-100 text-green-800",
  pending: "bg-amber-100 text-amber-800",
  cancelled: "bg-red-100 text-red-800",
  completed: "bg-blue-100 text-blue-800",
}

export default function ReservationsAdminPage() {
  const [filter, setFilter] = useState("all")
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null)
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false)
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false)
  const [actionType, setActionType] = useState<"confirmed" | "cancelled" | "completed" | null>(null)
  const [reservations, setReservations] = useState<Reservation[]>([])

  const filteredReservations =
    filter === "all"
      ? reservations
      : reservations.filter((r) => r.status === filter)

  const { loading, fetchReservations, updateReservation } = useReservation()

  useEffect(() => {
    fetchReservations().then(setReservations)
  }, [])

  const handleActionClick = (
    reservation: Reservation,
    type: "confirmed" | "cancelled" | "completed"
  ) => {
    setSelectedReservation(reservation)
    setActionType(type)
    setIsConfirmDialogOpen(true)
  }

  const handleConfirmAction = async () => {
    if (!selectedReservation || !actionType) return

    await updateReservation({
      reservation_id: selectedReservation.id,
      status: actionType,
    })
    setReservations((prev) =>
      prev.map((r) =>
        r.id === selectedReservation.id ? { ...r, status: actionType } : r
      )
    )
    setIsConfirmDialogOpen(false)
    setSelectedReservation(null)
    setActionType(null)
  }

  return (
    <div>
      {/* Header & Filter */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-foreground mb-4">Reservations</h2>
        <div className="flex gap-2">
          {["all", "confirmed", "pending", "cancelled", "completed"].map((status) => (
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

      {/* Reservations List */}
      <Card>
        <CardHeader>
          <CardTitle>Reservations ({filteredReservations.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {filteredReservations.map((r) => (
              <div
                key={r.id}
                className="flex items-center justify-between p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition"
              >
                <div className="flex items-center gap-4 flex-1">
                  <div className="flex-1">
                    <p className="font-semibold text-foreground">
                      {r.user.first_name} {r.user.last_name}
                    </p>
                    <div className="flex gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {r.date} at {r.time}
                      </span>
                      <span>{r.guests} guests</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <Badge
                    className={statusColors[r.status as keyof typeof statusColors]}
                  >
                    {r.status}
                  </Badge>

                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setSelectedReservation(r)
                      setIsDetailsDialogOpen(true)
                    }}
                  >
                    Details
                  </Button>

                  {r.status !== "confirmed" && (
                    <Button
                      size="sm"
                      variant="success"
                      onClick={() => handleActionClick(r, "confirmed")}
                    >
                      Set as Confirmed
                    </Button>
                  )}

                  {r.status !== "cancelled" && (
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleActionClick(r, "cancelled")}
                    >
                      Set as Cancelled
                    </Button>
                  )}

                  {r.status !== "completed" && (
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => handleActionClick(r, "completed")}
                    >
                      Set as Completed
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Reservation Details Dialog */}
      <ReservationDetailsDialog
        isOpen={isDetailsDialogOpen}
        onOpenChange={setIsDetailsDialogOpen}
        reservation={selectedReservation}
      />

      {/* Confirm Action Dialog */}
      <Dialog open={isConfirmDialogOpen} onOpenChange={setIsConfirmDialogOpen}>
        <DialogContent>
          <DialogTitle>Confirm Action</DialogTitle>
          <DialogDescription>
            Are you sure you want to {actionType} this reservation?
          </DialogDescription>
          <DialogFooter className="flex justify-end gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsConfirmDialogOpen(false)}
            >
              Close
            </Button>
            <Button
              variant={
                actionType === "confirmed"
                  ? "success"
                  : actionType === "cancelled"
                  ? "destructive"
                  : "secondary"
              }
              size="sm"
              onClick={handleConfirmAction}
              disabled={loading}
            >
              {actionType === "confirmed"
                ? "Confirm"
                : actionType === "cancelled"
                ? "Cancel"
                : "Complete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}