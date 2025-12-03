// hooks/useCategories.ts
"use client";

import { useEffect, useState } from "react";
import { useApi } from "@/hooks/use-api";
import { useStore } from "@/lib/store";

export function useCategories() {
  const { callApi } = useApi("/admin/category", "GET");
  const { categories, setCategories } = useStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await callApi();
      setCategories(data);
    } catch (err: any) {
      console.error("Failed to fetch categories", err);
      setError(err.message || "Failed to fetch categories");
    } finally {
      setLoading(false);
    }
  };

  // POST request to create a new category
  const addCategory = async (name: string, description: string) => {
    setLoading(true);
    setError(null);
    try {
      const postApi = useApi("/admin/category", "POST"); // new instance for POST
      const newCategory = await postApi.callApi({ name, description });

      // Add the new category to Zustand store
      setCategories([...categories, newCategory]);

      return newCategory;
    } catch (err: any) {
      console.error("Failed to add category", err);
      setError(err.message || "Failed to add category");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (categories.length > 0) return;
    fetchCategories();
  }, [addCategory]);

  return { categories, loading, error, refresh: fetchCategories, addCategory };
}
