// hooks/useLogin.ts
"use client";

import { useApi } from "@/hooks/use-api";
import { useStore } from "@/lib/store";
import Cookies from "js-cookie";

export function useLogin() {
  const { data, loading, error, callApi } = useApi("/login", "POST");

  const { setUser } = useStore();

  const login = async (email: string, password: string) => {
    const response = await callApi({
      body: { email, password }
    });

    // Save token to cookies (Laravel passport / sanctum usually returns token)
    if (response?.token && response?.user) {
      const { id, first_name, last_name, email, phone_number, street_address, barangay, role } = response.user;

      const userData = {
        id,
        firstName: first_name,
        lastName: last_name,
        email,
        role,
        phoneNumber: phone_number,
        streetAddress: street_address,
        barangay,
      }

      setUser(userData);

      Cookies.set("token", response.token, {
        expires: 7,
        secure: process.env.NEXT_PUBLIC_APP_ENV === 'production' ? true : false,          // HTTPS required
        sameSite: process.env.NEXT_PUBLIC_APP_ENV === 'production' ? "none" : "lax",      // allows cross-site usage
      });

      Cookies.set("user", JSON.stringify(userData), {
        expires: 7,
        secure: process.env.NEXT_PUBLIC_APP_ENV === 'production' ? true : false,          // HTTPS required
        sameSite: process.env.NEXT_PUBLIC_APP_ENV === 'production' ? "none" : "lax",      // allows cross-site usage
      });

    }

    return response;
  };

  return {
    user: data,
    loading,
    error,
    login,
  };
}
