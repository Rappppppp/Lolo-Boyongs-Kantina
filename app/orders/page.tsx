"use client"

import { useEffect, useState } from "react";
import { OrdersManager } from "@/components/order/order-manager";
import { useStore } from "@/lib/store";
import { useRouter } from "next/navigation";

export default function OrdersPage() {
    // very important
    const [isReady, setIsReady] = useState(false);

    const { user } = useStore();
    const router = useRouter();

    useEffect(() => {
        if (!user) {
            router.push(`/login?redirect=/orders`);
            return;
        }

        setIsReady(true);
    }, [user, router]);

    return <div className="p-12">
        <OrdersManager />
    </div>
}