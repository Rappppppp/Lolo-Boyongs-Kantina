'use client';

import { useCallback, useEffect, useState } from 'react';
import { useApi } from '@/hooks/use-api';

export interface ChartPoint {
    label: string;
    value: number;
}

export interface DashboardData {
    total_orders: number;
    revenue: number;
    average_order_value: number;
    customers: number;
    orders_this_week: ChartPoint[];
    revenue_trend: ChartPoint[];
}

export function useDashboard() {
    const [loading, setLoading] = useState(false);
    const [dashboard, setDashboard] = useState<DashboardData | null>(null);

    const getDashboard = useApi<{ data: DashboardData }>("/admin/dashboard");

    const fetchDashboard = useCallback(async () => {
        setLoading(true);

        try {
            const res = await getDashboard.callApi();
            console.log(res)
            setDashboard(res.data);
        } catch (err: any) {
            console.error('Failed to fetch dashboard', err);
        } finally {
            setLoading(false);
        }
    }, [getDashboard]);

    return {
        fetchDashboard,
        dashboard,
        loading
    }
}