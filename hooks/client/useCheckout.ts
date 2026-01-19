import { useApi } from "@/hooks/use-api";
import { useStore } from "@/lib/store";

export const useCheckout = () => {
    const { data, loading, error, callApi } = useApi("/ordering", "POST");
    const { cartItems, clearCart } = useStore();

    const checkout = async (items: any[]) => {
        const payload = {
            menu_items: items.map(item => ({
                id: item.id,
                qty: item.quantity,
            })),
        }

        const response = await callApi({ body: payload })

        if (response?.order) {
            clearCart()
        }

        return response
    }

    return {
        checkout,
        loading,
        error
    };
}