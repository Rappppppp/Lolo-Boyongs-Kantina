"use client"

import { Dialog, DialogTitle, DialogDescription, DialogContent, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useReservation } from "@/hooks/client/useReservation"
import { Dispatch, SetStateAction } from "react";
import type { Reservation } from "@/app/types/reservations";

interface CancelReservationStatusDialogProps {
  selectedReservation: Reservation | null;
  isCancelDialogOpen: boolean;
  setIsCancelDialogOpen: Dispatch<SetStateAction<boolean>>;
  setSelectedReservation: Dispatch<SetStateAction<Reservation | null>>;
  setReservations: Dispatch<SetStateAction<Reservation[]>>;
}

function CancelReservationStatusDialog({
  selectedReservation,
  isCancelDialogOpen,
  setIsCancelDialogOpen,
  setSelectedReservation,
  setReservations
}: CancelReservationStatusDialogProps) {
  const { loading, updateReservation } = useReservation()

  const handleConfirmAction = async () => {
    if (!selectedReservation) return

    await updateReservation({
      reservation_id: selectedReservation.id,
      status: 'cancelled',
    })

    setReservations((prev) =>
      prev.map((r) =>
        r.id === selectedReservation?.id ? { ...r, status: "cancelled" } : r
      )
    );

    setIsCancelDialogOpen(false)
    setSelectedReservation(null)
  }

  return (
    <Dialog open={isCancelDialogOpen} onOpenChange={setIsCancelDialogOpen}>
      <DialogContent>
        <DialogTitle>Confirm Action</DialogTitle>
        <DialogDescription>
          Are you sure you want to cancel this reservation?
        </DialogDescription>
        <DialogFooter className="flex justify-end gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsCancelDialogOpen(false)}
          >
            Close
          </Button>
          <Button
            variant='destructive'
            size="sm"
            onClick={handleConfirmAction}
            disabled={loading}
          >
            Cancel Reservation
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default CancelReservationStatusDialog