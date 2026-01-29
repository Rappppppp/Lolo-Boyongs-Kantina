'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { Edit2, Phone, Mail, MapPin, Users, Save, X } from 'lucide-react'
import { Order, OrderItem } from '@/app/types/order'
import { User } from '@/app/types/user'

interface StatusConfig {
    [key: string]: {
        label: string
        color: string
    }
}

interface StatusFlow {
    [key: string]: string | null
}

interface OrderDetailsDialogProps {
    isDialogOpen: boolean
    onOpenChange: (open: boolean) => void
    selectedOrder: Order | null
    riders: User[]
    statusConfig: StatusConfig
    statusFlow: StatusFlow
    onStatusChange: (orderId: string, newStatus: string) => void
    onSaveNotes: (orderId: string, notes: string) => void
    onRiderAssign: (order: Order, rider: User) => void
}

export function OrderDetailsDialog({
    isDialogOpen,
    onOpenChange,
    selectedOrder,
    riders,
    statusConfig,
    statusFlow,
    onStatusChange,
    onSaveNotes,
    onRiderAssign,
}: OrderDetailsDialogProps) {
    const [isEditingNotes, setIsEditingNotes] = useState(false)
    const [editedNotes, setEditedNotes] = useState(selectedOrder?.notes || '')


    const getNextButtonLabel = (status: string) => {
        if (status === 'pending') return 'Confirm'
        if (status === 'confirmed') return 'Start Delivery'
        if (status === 'otw') return 'Mark Completed'
        return 'Next'
    }


    const handleStatusChange = (orderId: string, newStatus: string) => {
        onStatusChange(orderId, newStatus)
    }

    const handleSaveNotes = (orderId: string) => {
        onSaveNotes(orderId, editedNotes)
        setIsEditingNotes(false)
    }

    const handleRiderSelect = (riderId: number) => {
        const rider = riders.find((r) => r.id === riderId)
        if (!rider || !selectedOrder) return
        onRiderAssign(selectedOrder, rider)
    }

    return (
        <Dialog open={isDialogOpen} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-0 flex flex-col">
                {/* Header */}
                <DialogHeader className="sticky top-0 bg-background border-b border-border px-6 py-4 rounded-t-lg">
                    <div className="flex items-start justify-between w-full">
                        <div>
                            <DialogTitle className="text-2xl font-bold">
                                Order #{selectedOrder?.order_id}
                            </DialogTitle>
                            <p className="text-sm text-muted-foreground mt-1">
                                {selectedOrder?.created_at_human}
                            </p>
                        </div>
                    </div>
                </DialogHeader>

                {selectedOrder && (
                    <div className="flex-1 overflow-y-auto space-y-6 px-6 py-6">
                        {/* Status and Quick Info */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="bg-card border border-border rounded-lg p-4">
                                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                                    Current Status
                                </p>
                                <Badge
                                    className={
                                        statusConfig[selectedOrder.status as keyof typeof statusConfig]
                                            ?.color || 'bg-gray-500'
                                    }
                                >
                                    {statusConfig[selectedOrder.status as keyof typeof statusConfig]
                                        ?.label || selectedOrder.status}
                                </Badge>
                            </div>

                            <div className="bg-card border border-border rounded-lg p-4">
                                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                                    Total Amount
                                </p>
                                <p className="text-2xl font-bold text-foreground">
                                    ₱{selectedOrder.items_total}
                                </p>
                            </div>
                        </div>

                        {/* Delivery Information */}
                        <div className="bg-card border border-border rounded-lg p-5">
                            <h3 className="font-semibold text-sm text-foreground mb-4">
                                Delivery Information
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {/* Recipient */}
                                <div className="flex gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                                        <Users className="w-4 h-4 text-primary" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-semibold text-muted-foreground uppercase">
                                            Recipient
                                        </p>
                                        <p className="font-medium text-foreground mt-1">
                                            {selectedOrder.receipient_name}
                                        </p>
                                    </div>
                                </div>

                                {/* Phone */}
                                <div className="flex gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                                        <Phone className="w-4 h-4 text-primary" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-semibold text-muted-foreground uppercase">
                                            Phone
                                        </p>
                                        <p className="font-medium text-foreground mt-1">
                                            {selectedOrder.phone_number}
                                        </p>
                                    </div>
                                </div>

                                {/* Email */}
                                <div className="flex gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                                        <Mail className="w-4 h-4 text-primary" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-semibold text-muted-foreground uppercase">
                                            Email
                                        </p>
                                        <p className="font-medium text-foreground mt-1">
                                            {selectedOrder.email}
                                        </p>
                                    </div>
                                </div>

                                {/* Address */}
                                <div className="flex gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                                        <MapPin className="w-4 h-4 text-primary" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-semibold text-muted-foreground uppercase">
                                            Address
                                        </p>
                                        <p className="font-medium text-foreground mt-1">
                                            {selectedOrder.address}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Order Items */}
                        <div>
                            <h3 className="font-semibold text-sm text-foreground mb-3">
                                Order Items ({selectedOrder.items.length})
                            </h3>
                            <div className="bg-card border border-border rounded-lg overflow-hidden">
                                {selectedOrder.items.map((item, idx) => (
                                    <div
                                        key={idx}
                                        className={`flex justify-between items-center px-5 py-3 ${idx !== selectedOrder.items.length - 1
                                                ? 'border-b border-border'
                                                : ''
                                            }`}
                                    >
                                        <div className="flex-1">
                                            <p className="font-medium text-foreground text-sm">
                                                {item.menu_item_name}
                                            </p>
                                            <p className="text-xs text-muted-foreground mt-1">
                                                Qty: {item.quantity}
                                            </p>
                                        </div>
                                        <span className="font-semibold text-foreground ml-4">
                                            ₱{(item.price * item.quantity).toFixed(2)}
                                        </span>
                                    </div>
                                ))}

                                {/* Total */}
                                <div className="bg-muted/30 px-5 py-3 flex justify-between font-bold text-sm">
                                    <span>Total</span>
                                    <span className="text-primary">₱{selectedOrder.items_total}</span>
                                </div>
                            </div>
                        </div>

                        {/* Rider Assignment */}
                        <div className="bg-card border border-border rounded-lg p-5">
                            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                                {selectedOrder.status === 'confirmed'
                                    ? 'Assign Rider'
                                    : 'Assigned Rider'}
                            </p>

                            {selectedOrder.status === 'confirmed' || selectedOrder.status === 'pending' ? (
                                <Select value={selectedOrder?.rider?.id ?? ''} onValueChange={handleRiderSelect}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select a rider" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {riders.map((rider) => (
                                            <SelectItem key={rider.id} value={rider.id}>
                                                {rider.first_name} {rider.last_name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            ) : selectedOrder.rider ? (
                                <div className="flex items-center gap-3 bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
                                    <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-800 flex items-center justify-center">
                                        <Users className="w-5 h-5 text-green-600 dark:text-green-300" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-semibold text-green-900 dark:text-green-100">
                                            {selectedOrder.rider.name}
                                        </p>
                                        <p className="text-xs text-green-700 dark:text-green-300">
                                            {selectedOrder.rider.phone}
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <p className="text-sm text-muted-foreground py-2">
                                    No rider assigned yet.
                                </p>
                            )}
                        </div>

                        {/* Notes Section */}
                        <div className="bg-card border border-border rounded-lg p-5">
                            <div className="flex items-center justify-between mb-3">
                                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                                    Order Notes
                                </p>
                                {!isEditingNotes && (
                                    <Button
                                        size="sm"
                                        variant="ghost"
                                        onClick={() => {
                                            setEditedNotes(selectedOrder.notes || '')
                                            setIsEditingNotes(true)
                                        }}
                                        className="h-8 px-2 text-xs"
                                    >
                                        <Edit2 className="w-3 h-3 mr-1" />
                                        Edit
                                    </Button>
                                )}
                            </div>

                            {isEditingNotes ? (
                                <div className="space-y-2">
                                    <textarea
                                        value={editedNotes}
                                        onChange={(e) => setEditedNotes(e.target.value)}
                                        placeholder="Add notes for this order..."
                                        className="w-full px-3 py-2 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background"
                                        rows={3}
                                    />
                                    <div className="flex gap-2 justify-end">
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => setIsEditingNotes(false)}
                                        >
                                            <X className="w-3 h-3 mr-1" />
                                            Cancel
                                        </Button>
                                        <Button
                                            size="sm"
                                            onClick={() => handleSaveNotes(selectedOrder.order_id)}
                                        >
                                            <Save className="w-3 h-3 mr-1" />
                                            Save
                                        </Button>
                                    </div>
                                </div>
                            ) : (
                                <p className="text-sm text-foreground min-h-12 whitespace-pre-wrap">
                                    {selectedOrder.notes || 'No notes added yet.'}
                                </p>
                            )}
                        </div>
                    </div>
                )}

                {/* Footer Action Buttons */}
                <div className="sticky bottom-0 flex justify-end gap-2 px-6 py-4 border-t border-border bg-background rounded-b-lg">
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Close
                    </Button>
                    {statusFlow[selectedOrder?.status as keyof typeof statusFlow] && (
                        <Button
                            onClick={() => {
                                const nextStatus =
                                    statusFlow[selectedOrder!.status as keyof typeof statusFlow]
                                if (nextStatus) {
                                    handleStatusChange(selectedOrder!.order_id, nextStatus)
                                }
                            }}
                            disabled={
                                selectedOrder?.status === 'confirmed' && !selectedOrder?.rider?.id
                            }
                        >
                            {getNextButtonLabel(selectedOrder?.status || '')}
                        </Button>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    )
}
