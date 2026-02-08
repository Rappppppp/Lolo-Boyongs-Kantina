import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
// import { Clock, Users, Calendar } from 'lucide-react';
import { type Reservation } from '@/app/types/reservations';

interface ReservationDetailsDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  reservation: Reservation | null;
}

export function ReservationDetailsDialog({ isOpen, onOpenChange, reservation }: ReservationDetailsDialogProps) {
  if (!reservation) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto p-6 flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Reservation Details</DialogTitle>
          <p className="text-sm text-muted-foreground">{reservation.date} at {reservation.time}</p>
        </DialogHeader>

        <div className="mt-4 space-y-4">
              <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase">Reserved by:</p>
            <p className="text-foreground font-medium">{reservation.user.first_name} {reservation.user.last_name}</p>
            <p className='text-xs text-gray-500'>
                <a href={`mailto:${reservation.user.email}`}>{reservation.user.email}</a>
            </p>
            <p className='text-xs text-gray-500'>
                <a href={`tel:${reservation.user.phone_number}`}>{reservation.user.phone_number}</a>
            </p>
          </div>

          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase">Guests</p>
            <p className="text-foreground font-medium">{reservation.guests}</p>
          </div>

          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase">Status</p>
            <p className="text-foreground font-medium">{reservation.status}</p>
          </div>

          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase">Additional Info</p>
            <p className="text-foreground font-medium">{reservation.notes || "No notes added."}</p>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
