"use client";

import { useApi } from "@/hooks/use-api";

export function useFilepond() {
  const { data, loading, error, callApi } = useApi<any>("/filepond", "POST");

  const fileUpload = async (files: File | File[]): Promise<any> => {
    const formData = new FormData();
    const fileArray = Array.isArray(files) ? files : [files];

    fileArray.forEach((file) => {
      formData.append("filepond", file);
    });

    return await callApi({
      body: formData,
      isFormData: true,
    });
  };

  return {
    data,
    loading,
    error,
    fileUpload,
  };
}
