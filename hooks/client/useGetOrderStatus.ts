'use client';

import { useApi } from "@/hooks/use-api";
import type { Order } from "@/app/types/order";

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success?: boolean;
}

export const useGetOrderStatus = () => {
  const { data, loading, error, callApi } = useApi("/ordering");

  const getOrderStatus = async (
    orderId: string
  ): Promise<ApiResponse<Order>> => {
    const response = await callApi<ApiResponse<Order>>({
      urlOverride: `/ordering/${orderId}`,
    });

    return response;
  };

  return {
    getOrderStatus,
    data,
    loading,
    error,
  };
};
