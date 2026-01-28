import { useApi } from "@/hooks/use-api";
import { useStore } from "@/lib/store";

export const useGetOrderStatus = () => {
    const { data, loading, error, callApi } = useApi("/ordering", "GET");

    const getOrderStatus = async (orderId: string) => {

        const response = await callApi({
            urlOverride: `/ordering/${orderId}`
        })

        // console.log("Order Status Response:", response);

        return response
    }

    return {
        getOrderStatus,
        data,
        loading,
        error
    };
}