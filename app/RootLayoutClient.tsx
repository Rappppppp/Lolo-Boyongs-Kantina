"use client";

import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useStore } from "@/lib/store";
import { Toaster } from "@/components/ui/toaster";
import { Analytics } from "@vercel/analytics/next";
import { Geist } from "next/font/google";

const geist = Geist({ subsets: ["latin"], weight: "400" });

export default function RootLayoutClient({ children }: { children: React.ReactNode }) {
  const { setUser } = useStore();
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const cookieUser = Cookies.get("user");
    if (cookieUser) {
      try {
        setUser(JSON.parse(cookieUser));
      } catch {
        setUser(null);
      }
    }
    setHydrated(true);
  }, [setUser]);

  if (!hydrated) return null;

  return (
    <div className={`${geist.className} antialiased`}>
      {children}
      <Analytics />
      <Toaster />
    </div>
  );
}
