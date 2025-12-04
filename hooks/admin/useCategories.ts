"use client";

import { useEffect, useState, useCallback } from "react";
import { useApi } from "@/hooks/use-api";
import { useStore } from "@/lib/store";

export function useCategories() {
  const getApi = useApi("/admin/category", "GET");
  const postApi = useApi("/admin/category", "POST");
  const putApi = useApi("/admin/category", "PUT");

  const { categories, setCategories, updateCategory: updateCategoryStore } = useStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await getApi.callApi();
      setCategories(data);
    } catch (err: any) {
      console.error("Failed to fetch categories", err);
      setError(err.message || "Failed to fetch categories");
    } finally {
      setLoading(false);
    }
  }, [getApi, setCategories]);

  const addCategory = useCallback(
    async (name: string, description: string) => {
      // setLoading(true);
      setError(null);

      try {
        const res = await postApi.callApi({ body: {
          name, description
        } });

        setCategories([...categories, res.data]);

        return res.data;
      } catch (err: any) {
        console.error("Failed to add category", err);
        setError(err.message || "Failed to add category");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [postApi, categories, setCategories]
  );

  const updateCategory = useCallback(
    async (id: number, name: string, description: string) => {
      try {
        // Perform PUT request to dynamic URL
        const updated = await putApi.callApi({
          body: { name, description },
          urlOverride: `/admin/category/${id}`,
        });

        updateCategoryStore(id, { name, description });

        return updated;
      } catch (err: any) {
        console.error("Failed to update category", err);
        throw err;
      }
    },
    [categories, setCategories, putApi]
  );

  useEffect(() => {
    if (categories.length === 0) {
      fetchCategories();
    }
  }, []);

  return {
    categories,
    loading,
    error,
    refresh: fetchCategories,
    addCategory,
    updateCategory,
  };
}
