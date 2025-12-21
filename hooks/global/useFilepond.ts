"use client";

import { useApi } from "@/hooks/use-api";

export function useFilepond() {
  const { data, loading, error, callApi } = useApi<any>("/filepond", "POST");

  const fileUpload = async (files: File | File[]): Promise<any> => {
    const formData = new FormData();
    const fileArray = Array.isArray(files) ? files : [files];
    
 fileArray.forEach(file => formData.append("filepond[]", file));

    // Pass the FormData directly — do NOT wrap inside a JSON object
    return await callApi({
      body: formData,
      isFormData: true, // make sure useApi does not stringify or override headers
    });
  };

  return {
    data,
    loading,
    error,
    fileUpload,
  };
}
