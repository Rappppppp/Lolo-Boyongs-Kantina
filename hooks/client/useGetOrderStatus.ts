import { useCallback } from "react";
import { useApi } from "@/hooks/use-api";

export const useGetOrderStatus = () => {
    const { data, loading, error, callApi } = useApi("/ordering");

    const getOrderStatus = useCallback(async (orderId: string) => {
        const response = await callApi({
            urlOverride: `/ordering/${orderId}`
        })
        return response
    }, [callApi]);

    return {
        getOrderStatus,
        data,
        loading,
        error
    };
}