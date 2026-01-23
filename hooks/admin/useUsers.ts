"use client"

import { useState, useCallback } from "react"
import { useApi } from "@/hooks/use-api"
import { Rider } from "@/app/types/order"

export function useUsers() {
    const [loading, setLoading] = useState(false)

    // GET /admin/order
    const listApi = useApi<{ data: Rider[] }>("/admin/users", "GET")

    // ✅ Fetch orders
    const fetchUsers = useCallback(async (role?: string) => {
        setLoading(true)
        try {
            const res = await listApi.callApi({
                urlOverride: `/admin/users/${role}`,
            })
            return res.data
        } catch (err: any) {
            throw err
        } finally {
            setLoading(false)
        }
    }, [listApi.callApi])

    return {
        fetchUsers,
        loading: loading || listApi.loading,
    }
}
