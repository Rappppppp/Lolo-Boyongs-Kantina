"use client";

import { useApi } from "@/hooks/use-api";
import { useStore } from "@/lib/store";
import Cookies from "js-cookie";

export function useLogout() {
  // Prepare API caller — adjust to your actual logout endpoint
  const { loading, error, callApi } = useApi("/logout");

  const { setUser } = useStore();

  const logout = async () => {
    try {
      // Try to notify backend (optional, depending on your Laravel config)
      await callApi({
        method: "POST",
        body: JSON.stringify({ logout: true }),
      });

    } catch (e) {
      // Don't block logout on API failure — still continue clearing session
      console.warn("Logout API failed, continuing cleanup.");
    }

    // Remove token
    Cookies.remove("token");

    // Clear Zustand user state
    setUser(null);
  };

  return {
    loading,
    error,
    logout,
  };
}
