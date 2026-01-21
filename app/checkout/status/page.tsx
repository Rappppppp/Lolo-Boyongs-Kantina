'use client';

import { useState, useEffect } from 'react';
import OrderStatusTracker from '@/components/order/order-status-tracker';
import OrderDetails from '@/components/order/order-details';
import DriverInfo from '@/components/order/driver-info';
import OrderChat from '@/components/order/order-chat';
import { useSearchParams } from 'next/navigation';
import { useGetOrderStatus } from '@/hooks/client/useGetOrderStatus';

export default function Home() {
    const searchParams = useSearchParams()
    const orderId = searchParams.get("orderId")

    if (!orderId) {
        return <div className="p-8 text-center text-red-600">Order ID is missing in the URL.</div>;
    }

    const { data, getOrderStatus } = useGetOrderStatus();

    const [orderStatus, setOrderStatus] = useState('pending');
    const [refreshCount, setRefreshCount] = useState(0);

    // Simulate API call every 5 seconds
    useEffect(() => {
        // fetch order
        getOrderStatus(Number(orderId));

        setOrderStatus(data?.status || 'pending');

        // const interval = setInterval(() => {
        //     setRefreshCount(prev => prev + 1);

        //     // Simulate status progression
        //     const statuses = ['pending', 'confirmed', 'preparing', 'ready_pickup', 'on_way', 'arrived', 'completed'];
        //     setOrderStatus(prev => {
        //         const currentIndex = statuses.indexOf(prev);
        //         if (currentIndex < statuses.length - 1) {
        //             // 70% chance to progress to next status every 2 polling cycles
        //             return Math.random() > 0.7 ? statuses[currentIndex + 1] : prev;
        //         }
        //         return prev;
        //     });
        // }, 5000);

        // return () => clearInterval(interval);
    }, []);

    return (
        <main className="min-h-screen bg-gradient-to-br from-white to-orange-50">
            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-4">
                        <h1 className="text-3xl font-bold text-foreground">Order #1024</h1>
                        <div className="text-sm text-muted-foreground">
                            Last updated: {new Date().toLocaleTimeString()}
                        </div>
                    </div>
                    <p className="text-muted-foreground">est. {Math.floor(Math.random() * 15) + 5} mins away</p>
                </div>

                {/* Main content grid */}
                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Left column - Status tracker */}
                    <div className="lg:col-span-2">
                        <OrderStatusTracker status={orderStatus} refreshCount={refreshCount} />
                        <OrderDetails status={orderStatus} />
                    </div>

                    {/* Right column - Driver info and chat */}
                    <div className="space-y-6">
                        <DriverInfo status={orderStatus} />
                        <OrderChat />
                    </div>
                </div>
            </div>
        </main>
    );
}
