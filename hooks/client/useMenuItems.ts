"use client";

import { useEffect, useState } from "react";
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

export function useMenuItems() {
  const { loading, error, callApi } = useApi<PaginatedResponse<MenuItem>>("/menu-item");

  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);

  const fetchMenuItems = async () => {
    try {
      const response = await callApi();
      if (response?.data) {
        setMenuItems(response.data);
        return response.data;
      }
      return [];
    } catch (err) {
      console.error("Failed to fetch menu items:", err);
      return [];
    }
  };

  useEffect(() => {
    fetchMenuItems();
  }, []);

  return {
    menuItems,
    loading,
    error,
    refetch: fetchMenuItems
  };
}
