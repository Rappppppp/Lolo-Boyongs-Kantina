"use client";

import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useStore } from "@/lib/store";
import { Toaster } from "@/components/ui/toaster";
import { Analytics } from "@vercel/analytics/next";
import { Geist } from "next/font/google";
import Navigation from "@/components/navigation";
import OrderCart from "@/components/order-cart";
import { usePathname } from "next/navigation";

const geist = Geist({ subsets: ["latin"], weight: "400" });

export default function RootLayoutClient({ children }: { children: React.ReactNode }) {
  const { user, setUser } = useStore();
  const [cartOpen, setCartOpen] = useState(false)
  const pathname = usePathname();

  useEffect(() => {
    // Always scroll to top on route change
    window.scrollTo({ top: 0, behavior: "instant" })

    // Close cart / overlays when navigating
    setCartOpen(false)
  }, [pathname])

  useEffect(() => {
    const cookieUser = Cookies.get("user");
    if (cookieUser) {
      try {
        setUser(JSON.parse(cookieUser));
      } catch {
        setUser(null);
      }
    }
  }, [setUser]);

  return (
    <div className={`${geist.className} antialiased min-h-screen ${cartOpen ? 'bg-black/80' : 'bg-background'}`}>

      {
        !pathname.includes('/admin') &&
        <>
          {
            user?.role !== 'rider' &&
            <Navigation onCartClick={() => setCartOpen(!cartOpen)} />
          }

          {/* Cart Sidebar */}
          <OrderCart isOpen={cartOpen} onClose={() => setCartOpen(false)} />
        </>
      }

      {children}
      <Analytics />
      <Toaster />
    </div>
  );
}
