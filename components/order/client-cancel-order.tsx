"use client"

import { Dialog, DialogTitle, DialogDescription, DialogContent, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Dispatch, SetStateAction } from "react";
import type { Order } from "@/app/types/order";
import { useOrders } from "@/hooks/rider/useOrders";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface CancelOrderDialogProps {
    selectedOrder: Order | null;
    isCancelDialogOpen: boolean;
    setIsCancelDialogOpen: Dispatch<SetStateAction<boolean>>;
    setSelectedOrder: Dispatch<SetStateAction<Order | null>>;
    setOrders?: Dispatch<SetStateAction<Order[]>> | null;
}

function CancelOrderDialog({
    selectedOrder,
    isCancelDialogOpen,
    setIsCancelDialogOpen,
    setSelectedOrder,
    setOrders
}: CancelOrderDialogProps) {
    const router = useRouter();
    const { loading, updateOrderStatus } = useOrders();

    const handleConfirmAction = async () => {
        if (!selectedOrder) return

        updateOrderStatus({
            order_id: selectedOrder.order_id,
            status: 'cancelled',
        })

        if (setOrders) {
            setOrders((prev) =>
                prev.map((order) =>
                    order.order_id === selectedOrder?.order_id ? { ...order, status: "cancelled" } : order
                )
            );
        }

        setIsCancelDialogOpen(false)
        setSelectedOrder(null)
        router.push('/orders')
    }

    return (
        <Dialog open={isCancelDialogOpen} onOpenChange={setIsCancelDialogOpen}>
            <DialogContent>
                <DialogTitle>Confirm Action</DialogTitle>
                <DialogDescription>
                    Are you sure you want to cancel this order?
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
                        Cancel Order
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

export default CancelOrderDialog