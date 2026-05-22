'use client';

import { useCallback, useState } from 'react';
import { useApi } from '@/hooks/use-api';

export interface ChartPoint {
    label: string;
    value: number;
}

export interface TopItem {
    name: string;
    total_qty: number;
    total_revenue: number;
}

export interface RecentOrder {
    order_id: string;
    receipient_name: string;
    status: string;
    items_total: number;
    created_at_human: string;
}

export interface DashboardData {
    // KPIs
    total_orders: number;
    revenue: number;
    average_order_value: number;
    customers: number;
    riders_count: number;

    // Status breakdown
    pending_orders: number;
    confirmed_orders: number;
    otw_orders: number;
    delivered_orders: number;
    cancelled_orders: number;

    // Charts
    orders_this_week: ChartPoint[];
    revenue_trend: ChartPoint[];

    // Tables
    top_items: TopItem[];
    recent_orders: RecentOrder[];
}

export function useDashboard() {
    const [loading, setLoading] = useState(false);
    const [dashboard, setDashboard] = useState<DashboardData | null>(null);

    const getDashboard = useApi<{ data: DashboardData }>("/admin/dashboard");

    const { callApi: fetchDashboardApi } = getDashboard;

    const fetchDashboard = useCallback(async () => {
        setLoading(true);

        try {
            const res = await fetchDashboardApi();
            setDashboard(res.data);
        } catch (err: any) {
            console.error('Failed to fetch dashboard', err);
        } finally {
            setLoading(false);
        }
    }, [fetchDashboardApi]);

    return {
        fetchDashboard,
        dashboard,
        loading
    }
}