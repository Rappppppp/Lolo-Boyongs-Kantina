import { Order } from "@/app/types/order";
import { useApi } from "@/hooks/use-api";
import { useStore } from "@/lib/store";

export const useCheckout = () => {

    type CheckoutPayload = {
        fullName: string
        email: string
        phoneNumber: string
        address: string
        notes?: string
        paymentMethod: "cash" | "gcash" | "card"
        gcashRef?: string
        items: typeof cartItems
    }

    const { data, loading, error, callApi } = useApi("/ordering");
    const { cartItems, clearCart } = useStore();

    const checkout = async (checkoutPayload: CheckoutPayload) => {
        const payload = {
            full_name: checkoutPayload.fullName,
            email: checkoutPayload.email,
            phone_number: checkoutPayload.phoneNumber,
            street_address: checkoutPayload.address,
            notes: checkoutPayload.notes ?? null,
            payment_method: checkoutPayload.paymentMethod,
            gcash_ref: checkoutPayload.gcashRef ?? null,
            menu_items: checkoutPayload.items.map(item => ({
                id: item.id,
                qty: item.quantity,
            })),
        }

        const response = await callApi({ method: 'POST', body: payload })

        if (
            typeof response === "object" &&
            response !== null &&
            "order" in response
        ) {
            clearCart();
        }

        return response
    }

    return {
        checkout,
        loading,
        error
    };
}