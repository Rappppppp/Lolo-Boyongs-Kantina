'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import OrderStatusTracker from '@/components/order/order-status-tracker';
import OrderDetails from '@/components/order/order-details';
import DriverInfo from '@/components/order/driver-info';
import OrderChat from '@/components/order/order-chat';
import { useSearchParams } from 'next/navigation';
import { useGetOrderStatus } from '@/hooks/client/useGetOrderStatus';

import { Order } from '@/app/types/order';
import { Button } from '@/components/ui/button';
import CancelOrderDialog from '@/components/order/client-cancel-order';

function OrderStatusContent() {
    const searchParams = useSearchParams();
    const orderId = searchParams.get('orderId');

    const { data, getOrderStatus } = useGetOrderStatus();
    const [order, setOrder] = useState<Order | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [cancelDialogOpen, setCancelDialogOpen] = useState(false);

    // Stable fetch function — orderId is all we need; do NOT add `order` here
    // as that would restart the polling interval on every successful response
    const fetchOrder = useCallback(async () => {
        if (!orderId) return;
        try {
            const res = await getOrderStatus(orderId);
            
            if (!res?.data) {
                setError('No order data received');
                setIsLoading(false);
                return;
            }

            const newData = res.data;
            
            const stored = sessionStorage.getItem(`orderId=${orderId}`);
            const storedData = stored ? JSON.parse(stored) : null;

            // Only update if changed (avoids unnecessary re-renders)
            if (!storedData || storedData.status !== newData.status || !order) {
                setOrder(newData);
                sessionStorage.setItem(`orderId=${orderId}`, JSON.stringify(newData));
            }
            
            setIsLoading(false);
            setError(null);
        } catch (err) {
            console.error("Failed to fetch order:", err);
            setError(err instanceof Error ? err.message : 'Failed to fetch order');
            setIsLoading(false);
        }
    }, [orderId, getOrderStatus]); // intentionally omits `order` to keep interval stable

    useEffect(() => {
        if (!orderId) return;
        // Initial fetch
        fetchOrder();

        // Set up interval for subsequent fetches
        const interval = setInterval(fetchOrder, 10000);

        return () => {
            clearInterval(interval);
        };
    }, [fetchOrder, orderId]);

    if (!orderId) {
        return (
            <div className="p-8 text-center text-red-600">
                Order ID is missing in the URL.
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-8 text-center text-red-600">
                Error: {error}
            </div>
        );
    }

    if (isLoading || !order) {
        return <div className="p-8 text-center text-gray-500">Loading order...</div>;
    }

    return (
        <>
        <CancelOrderDialog selectedOrder={order} isCancelDialogOpen={cancelDialogOpen} setIsCancelDialogOpen={setCancelDialogOpen} setSelectedOrder={setOrder} />

        <div className="min-h-screen bg-gradient-to-br from-white to-orange-50">
            <div className="container mx-auto px-4 py-8">
                <div>{order.status === 'pending' && <Button onClick={() => setCancelDialogOpen(true)} variant='destructive' className='mb-4' size='lg'>Cancel Order</Button>}</div>
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-4">
                        <h1 className="text-3xl font-bold text-foreground">
                            Order #{order.order_id}
                        </h1>
                        <div className="text-sm text-muted-foreground">
                            Last updated: {new Date().toLocaleTimeString()}
                        </div>
                    </div>
                </div>

                {/* div content grid */}
                <div className="grid gap-8">
                    {/* Left column - Status tracker */}
                    <div className="space-y-6">
                        <OrderStatusTracker
                            order={order}
                        />
                        <DriverInfo order={order} />
                        <OrderDetails order={order} />

                    </div>
                </div>
            </div>
        </div>
        </>
    );
}

export default function OrderStatusPage() {
    return (
        <Suspense fallback={<div className="p-8 text-center text-gray-500">Loading...</div>}>
            <OrderStatusContent />
        </Suspense>
    );
}