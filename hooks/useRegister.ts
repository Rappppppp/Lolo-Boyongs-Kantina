// hooks/useRegister.ts
"use client";

import { useApi } from "@/hooks/use-api";
import { useState } from "react";
import { useRouter } from "next/navigation";

export function useRegister() {
  const router = useRouter();
  const { data, loading: apiLoading, error: apiError, callApi } = useApi("/register", "POST");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const register = async (payload: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;
    phoneNumber?: string;
    streetAddress?: string;
    barangay?: string;
  }) => {
    setLoading(true);
    setError(null);

    try {
      const response = await callApi({
        body: {
          first_name: payload.firstName,
          last_name: payload.lastName,
          email: payload.email,
          password: payload.password,
          confirm_password: payload.confirmPassword,
          phone_number: payload.phoneNumber,
          street_address: payload.streetAddress,
          barangay: payload.barangay,
        }
      });

      // Optionally, redirect to login page
      router.push("/login");

      return response;
    } catch (err: any) {
      console.error("Registration failed:", err);
      setError(err?.message || "Registration failed");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    data,
    loading: loading || apiLoading,
    error: error || apiError,
    register,
  };
}
