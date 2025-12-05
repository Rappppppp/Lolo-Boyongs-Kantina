"use client";

import { useEffect } from "react";
import { useApi } from "@/hooks/use-api";

export interface MenuImage {
  path: string;
  alt_text: string;
  sort_order: number;
  is_featured: boolean;
}

export interface MenuItem {
  id: number;
  category: string;
  name: string;
  price: string;
  price_raw: number;
  images: MenuImage[];
}

export interface PaginatedResponse<T> {
  data: T[];
  links: any;
  meta: any;
}

// Payload type for creating menu items
export interface CreateMenuItemPayload {
  category_id: number;
  name: string;
  price: number;
  description?: string;
  inventory_items?: { id: number; quantity_used: number }[];
  filepond?: string[]; // FilePond blob strings
}

export function useMenuItems() {
  const { data, loading, error, callApi } = useApi<PaginatedResponse<MenuItem>>(
    "/admin/menu-item",
    "GET"
  );

  const fetchMenuItems = async () => {
    return await callApi();
  };

  const createMenuItem = async (payload: CreateMenuItemPayload) => {
    let body: any = payload;
    let isFormData = false;

    // If there are images (as FilePond blobs), send as FormData
    if (payload.filepond && payload.filepond.length > 0) {
      const formData = new FormData();
      formData.append("category_id", String(payload.category_id));
      formData.append("name", payload.name);
      formData.append("price", String(payload.price));
      if (payload.description) formData.append("description", payload.description);

      payload.inventory_items?.forEach((inv, i) => {
        formData.append(`inventory_items[${i}][id]`, String(inv.id));
        formData.append(`inventory_items[${i}][quantity_used]`, String(inv.quantity_used));
      });

      // Append FilePond blobs (string values)
      payload.filepond.forEach((blob, i) => {
        formData.append(`images[${i}]`, blob);
      });

      body = formData;
      isFormData = true;
    }

    return await callApi({ body, isFormData });
  };

  useEffect(() => {
    fetchMenuItems();
  }, []);

  return {
    items: data?.data ?? [],
    pagination: data?.meta ?? null,
    links: data?.links ?? null,
    loading,
    error,
    refetch: fetchMenuItems,
    createMenuItem,
  };
}
