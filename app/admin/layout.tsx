"use client"

import type React from "react"

import { LayoutDashboard, Settings, BarChart3, Package, Clock, Pizza, Home, Utensils, Users, Table } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { appConfig } from "@/config/app.config"
import { useStore } from "@/lib/store"
import { useRouter } from "next/navigation"
import LogoutModal from "@/components/auth/logout-modal"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // very important
  const [isReady, setIsReady] = useState(false);

  const { user } = useStore();
  const router = useRouter();


  useEffect(() => {
    // Wait until we know the user
    if (user === undefined) return;

    if (!user || user.role !== "admin") {
      router.back(); // replace so user can't go back with back button
      return;
    }

    setIsReady(true);
  }, [user, router]);

  const [sidebarOpen, setSidebarOpen] = useState(true)

  const menuItems = [
    { href: "", icon: LayoutDashboard, label: "Dashboard" },
    { href: "users", icon: Users, label: "Users" },
    { href: "food-category", icon: Utensils, label: "Food Category" },
    // { href: "inventory", icon: Package, label: "Inventory" },
    { href: "menu", icon: Pizza, label: "Menu" },
    { href: "orders", icon: Clock, label: "Orders" },
    { href: "reservations", icon: Table, label: "Reservations" },
    // { href: "analytics", icon: BarChart3, label: "Analytics" },
    // { href: "settings", icon: Settings, label: "Settings" },
  ]

  if (!isReady) return null;
  return (
    <div className="flex h-screen bg-white">
      {/* Sidebar */}
      <aside
        className={`${sidebarOpen ? "w-64" : "w-20"} bg-card border-r border-border transition-all duration-300 flex flex-col`}
      >
        <div className="p-6 flex items-center justify-between bg-gradient-to-br from-primary to-orange-400 text-white">
          {sidebarOpen && <span className="text-lg font-bold">{appConfig.name}</span>}
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 hover:bg-orange-700 rounded cursor-pointer">
            {sidebarOpen ? "←" : "→"}
          </button>
        </div>

        <nav className="flex-1 space-y-2 px-4 py-3 bg-primary text-white">
          <Link
            href='/'
            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-orange-700 transition"
          >
            <Home className="w-5 h-5" />
            {sidebarOpen && <span className="text-sm">Homepage</span>}
          </Link>
          <div className="w-full h-px bg-white/50"></div>
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={`/admin/${item.href}`}
              className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-orange-700 transition"
            >
              <item.icon className="w-5 h-5" />
              {sidebarOpen && <span className="text-sm">{item.label}</span>}
            </Link>
          ))}
        </nav>

        <div className="p-4  bg-gradient-to-br from-primary to-orange-400">
          <LogoutModal>
            <Button className="w-full text-sm border border-orange-300" size="sm">
              {sidebarOpen ? "Logout" : "Exit"}
            </Button>
          </LogoutModal>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-gradient-to-br from-primary to-orange-400 text-white border-b border-border px-8 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Restaurant Admin</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm">Logged in as <b>{user?.firstName}</b></span>
          </div>
        </header>

        <main className="flex-1 overflow-auto p-8">{children}</main>
      </div>
    </div>
  )
}
