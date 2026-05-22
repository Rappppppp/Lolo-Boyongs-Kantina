"use client";

import { useEffect, useState, useCallback } from "react";
import { useApi } from "@/hooks/use-api";
import { useStore } from "@/lib/store";

export function useCategories() {
  const { callApi: getCallApi } = useApi("/admin/category");
  const { callApi: postCallApi } = useApi("/admin/category");
  const { callApi: putCallApi } = useApi("/admin/category");

  const { categories, setCategories, updateCategory: updateCategoryStore } = useStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await getCallApi();
      setCategories(data);
    } catch (err: any) {
      console.error("Failed to fetch categories", err);
      setError(err.message || "Failed to fetch categories");
    } finally {
      setLoading(false);
    }
  }, [getCallApi, setCategories]);

  const addCategory = useCallback(
    async (name: string, description: string) => {
      setError(null);

      try {
        const res = await postCallApi({
          method: "POST",
          body: { name, description },
        });

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
    [postCallApi, categories, setCategories]
  );

  const updateCategory = useCallback(
    async (id: number, name: string, description: string) => {
      try {
        const updated = await putCallApi({
          method: "PUT",
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
    [putCallApi, updateCategoryStore]
  );

  useEffect(() => {
    if (categories.length === 0) {
      fetchCategories();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
