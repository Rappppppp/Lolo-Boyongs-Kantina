"use client";

import { useApi } from "@/hooks/use-api";
import Cookies from "js-cookie";

export function useLogout() {
  const { loading, error, callApi } = useApi("/logout");

  const logout = async () => {
    try {
      // Notify backend to invalidate the token
      await callApi({ method: "POST" });
    } catch (e) {
      // Don't block logout on API failure — still continue clearing session
      console.warn("Logout API failed, continuing cleanup.");
    }

    // Remove token and user cookies
    Cookies.remove("token");
    Cookies.remove("user");
  };

  return { loading, error, logout };
}
