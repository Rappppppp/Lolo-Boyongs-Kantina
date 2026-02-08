'use client';

import { useState, useEffect, useCallback } from 'react';
import OrderStatusTracker from '@/components/order/order-status-tracker';
import OrderDetails from '@/components/order/order-details';
import DriverInfo from '@/components/order/driver-info';
import OrderChat from '@/components/order/order-chat';
import { useSearchParams } from 'next/navigation';
import { useGetOrderStatus } from '@/hooks/client/useGetOrderStatus';

import { Order } from '@/app/types/order';
import { Button } from '@/components/ui/button';
import CancelOrderDialog from '@/components/order/client-cancel-order';

export default function OrderStatusPage() {
    const searchParams = useSearchParams();
    const orderId = searchParams.get('orderId');

    const { data, getOrderStatus } = useGetOrderStatus();
    const [order, setOrder] = useState<Order | null>(null);
    const [refreshCount, setRefreshCount] = useState(0);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [cancelDialogOpen, setCancelDialogOpen] = useState(false);

    if (!orderId) {
        return (
            <div className="p-8 text-center text-red-600">
                Order ID is missing in the URL.
            </div>
        );
    }

    // Stable reference to the fetch function
    const fetchOrder = useCallback(async () => {
        try {
            console.log('Fetching order:', orderId);
            const res = await getOrderStatus(orderId);
            console.log('Response:', res);
            
            if (!res?.data) {
                console.error('No data in response:', res);
                setError('No order data received');
                setIsLoading(false);
                return;
            }

            const newData = res.data;
            console.log('Order data:', newData);
            
            const stored = sessionStorage.getItem(`orderId=${orderId}`);
            const storedData = stored ? JSON.parse(stored) : null;

            // Only update if changed
            if (!storedData || storedData.status !== newData.status) {
                setOrder(newData);
                sessionStorage.setItem(`orderId=${orderId}`, JSON.stringify(newData));
            } else if (!order) {
                // First load - set order even if it matches storage
                setOrder(newData);
            }
            
            setIsLoading(false);
            setError(null);
        } catch (err) {
            console.error("Failed to fetch order:", err);
            setError(err instanceof Error ? err.message : 'Failed to fetch order');
            setIsLoading(false);
        }
    }, [orderId, order]); // Add order to dependencies

    useEffect(() => {
        // Initial fetch
        fetchOrder();

        // Set up interval for subsequent fetches
        const interval = setInterval(fetchOrder, 10000);

        return () => {
            clearInterval(interval);
        };
    }, [fetchOrder]);

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
                            refreshCount={refreshCount}
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