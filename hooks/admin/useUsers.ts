"use client"

import { useCallback } from "react"
import { useApi } from "@/hooks/use-api"
import { User } from "@/app/types/user"

export type UserRole = "admin" | "rider" | "user"

interface ApiResponse<T> {
    data: T
}

export function useUsers() {
    const api = useApi<{ data: User[]; meta: { current_page: number; last_page: number } }>("/admin/users");

    /**
     * READ (list)
     */
    const fetchUsers = useCallback(
        async (params?: { page?: number; search?: string; role?: UserRole }) => {
            const query = new URLSearchParams();
            if (params?.page) query.set("page", params.page.toString());
            if (params?.search) query.set("search", params.search);
            if (params?.role) query.set("role", params.role);

            const res = await api.callApi({ urlOverride: `/admin/users?${query.toString()}` });
            return res
        },
        [api]
    );

    /**
     * CREATE
     */
    const createUser = useCallback(
        async (payload: Partial<User> & { password?: string }): Promise<User> => {
            const res = await api.callApi<ApiResponse<User>>({
                method: "POST",
                urlOverride: "/admin/users",
                body: payload,
            })

            return res.data
        },
        [api]
    )

    /**
     * UPDATE
     */
    const updateUser = useCallback(
        async (id: number, payload: Partial<User>): Promise<User> => {
            const res = await api.callApi<ApiResponse<User>>({
                method: "PUT",
                urlOverride: `/admin/users/${id}`,
                body: payload,
            })

            return res.data; 
        },
        [api]
    )

    /**
     * SOFT DELETE
     */
    const deleteUser = useCallback(
        async (id: number) => {
            await api.callApi({
                method: "DELETE",
                urlOverride: `/admin/users/${id}`,
            })
        },
        [api]
    )

    /**
     * RESTORE (soft-deleted)
     */
    const restoreUser = useCallback(
        async (id: number) => {
            const res = await api.callApi({
                method: "POST",
                urlOverride: `/admin/users/${id}/restore`,
            })

            return res.data
        },
        [api]
    )

    /**
     * FORCE DELETE
     */
    const forceDeleteUser = useCallback(
        async (id: number) => {
            await api.callApi({
                method: "DELETE",
                urlOverride: `/admin/users/${id}/force`,
            })
        },
        [api]
    )

    return {
        fetchUsers,
        createUser,
        updateUser,
        deleteUser,
        restoreUser,
        forceDeleteUser,
        loading: api.loading,
        error: api.error,
    }
}