"use client"

import { useState, useCallback, useEffect } from "react"
import { useApi } from "@/hooks/use-api"
import { useToast } from "@/components/ui/use-toast"
import { getInventoryStatus } from "@/lib/helpers"
import { useStore } from "@/lib/store"

export type Status = "good" | "low" | "critical"

export interface InventoryItem {
    id: number
    name: string
    unit: string
    current_stock: number
    reorder_level: number | null
    status: Status
}

export function useInventory() {
    const getApi = useApi<{ data: InventoryItem[] }>("/admin/inventory")
    const postApi = useApi("/admin/inventory")
    const putApi = useApi("/admin/inventory")
    const { toast } = useToast()

    const { inventory, setInventory, addInventory, updateInventory } = useStore()
    const [loading, setLoading] = useState(false)

    const fetchInventory = useCallback(async () => {
        setLoading(true)
        try {
            const res = await getApi.callApi()
            const data =
                res?.data?.map(item => ({
                    ...item,
                    status: getInventoryStatus(item.current_stock, item.reorder_level),
                })) ?? []

            setInventory(data)
            return data
        } catch (err: any) {
            toast({
                title: "Failed to fetch inventory",
                description: err.message || "Unknown error",
                variant: "destructive",
            })
            setInventory([])
            throw err
        } finally {
            setLoading(false)
        }
    }, [getApi, setInventory, toast])

    const reorderInventory = useCallback(
        async (itemIds: number[]) => {
            if (!itemIds.length) return
            try {
                await postApi.callApi({ body: { items: itemIds }, method: "POST" })
                toast({
                    title: "Reorder placed",
                    description: `${itemIds.length} item(s) reordered successfully`,
                })
            } catch (err: any) {
                toast({
                    title: "Failed to reorder",
                    description: err.message || "Unknown error",
                    variant: "destructive",
                })
                throw err
            } finally {
                setLoading(false)
            }
        },
        [postApi, toast]
    )

    const addItem = useCallback(
        async (item: Omit<InventoryItem, "id" | "status">) => {
            try {
                const newItem: InventoryItem = {
                    ...item,
                    status: getInventoryStatus(item.current_stock, item.reorder_level),
                    id: Math.max(0, ...inventory.map(i => i.id)) + 1, // temporary ID for FE store
                }
                await postApi.callApi({ body: newItem })

                // Update Zustand store immediately
                addInventory(newItem)

                toast({
                    title: "Item added",
                    description: `${item.name} added successfully`,
                    className: "bg-green-500 text-white border-green-600",
                    duration: 2000,
                })
            } catch (err: any) {
                toast({
                    title: "Failed to add item",
                    description: err.message || "Unknown error",
                    variant: "destructive",
                })
                throw err
            } finally {
                setLoading(false)
            }
        },
        [addInventory, inventory, postApi, toast]
    )

    const updateItem = useCallback(
        async (id: number, item: Omit<InventoryItem, "id" | "status">) => {
            try {
                const updatedItem: InventoryItem = {
                    ...item,
                    status: getInventoryStatus(item.current_stock, item.reorder_level),
                    id,
                }

                await putApi.callApi({
                    body: updatedItem,
                    urlOverride: `/admin/inventory/${id}`,
                    'method': 'PUT',
                })

                // Update Zustand store immediately
                updateInventory(id, updatedItem)

                toast({
                    title: "Item updated",
                    description: `${item.name} updated successfully`,
                    className: "bg-green-500 text-white border-green-600",
                    duration: 2000,
                })
            } catch (err: any) {
                toast({
                    title: "Failed to update item",
                    description: err.message || "Unknown error",
                    variant: "destructive",
                })
                throw err
            } finally {
                setLoading(false)
            }
        },
        [putApi, updateInventory, toast]
    )

    useEffect(() => {
        if (!inventory || inventory.length === 0) {
            fetchInventory().catch((err) =>
                toast({
                    title: "Failed to load inventory",
                    description: err.message,
                    variant: "destructive",
                })
            )
        }
    }, [fetchInventory, inventory, toast])

    return {
        inventory,
        fetchInventory,
        reorderInventory,
        addItem,
        updateItem,
        loading,
    }
}
