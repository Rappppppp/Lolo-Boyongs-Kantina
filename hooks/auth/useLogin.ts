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
      const { id, first_name, last_name, email, role } = response.user;

      const userData = {
        id,
        firstName: first_name,
        lastName: last_name,
        email,
        role
      }

      setUser(userData);

      Cookies.set("token", response.token, {
        expires: 7, // store 7 days, adjust as needed
        secure: true,
      });

      Cookies.set("user", JSON.stringify(userData), {
        expires: 7, // store 7 days, adjust as needed
        secure: true,
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
