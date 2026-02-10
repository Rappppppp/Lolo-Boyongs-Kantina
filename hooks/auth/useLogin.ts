// hooks/useLogin.ts
"use client";

import { User } from "@/app/types/user";
import { useApi } from "@/hooks/use-api";
import { useStore } from "@/lib/store";
import Cookies from "js-cookie";

export function useLogin() {
  const { data, loading, error, callApi } = useApi("/login");
  const { setUser } = useStore();

  const login = async (email: string, password: string): Promise<User> => {
    const response = await callApi<{ user: any; token: string }>({
      method: "POST",
      body: { email, password },
    });

    if (!response?.user || !response?.token) {
      throw new Error("Invalid login response");
    }

    const { id, first_name, last_name, email: userEmail, phone_number, street_address, barangay, role } = response.user;

    const userData: User = {
      id,
      first_name,
      last_name,
      email,
      role,
      phone_number,
      street_address,
      barangay,
    };

    setUser(userData);

    // Set cookies
    Cookies.set("token", response.token, {
      expires: 7,
      secure: process.env.NEXT_PUBLIC_APP_ENV === "production",
      sameSite: process.env.NEXT_PUBLIC_APP_ENV === "production" ? "none" : "lax",
    });

    Cookies.set("user", JSON.stringify(userData), {
      expires: 7,
      secure: process.env.NEXT_PUBLIC_APP_ENV === "production",
      sameSite: process.env.NEXT_PUBLIC_APP_ENV === "production" ? "none" : "lax",
    });

    return userData; // ✅ return proper User
  };

  return {
    user: data as User | null,
    loading,
    error,
    login,
  };
}
