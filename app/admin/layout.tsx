"use client"

import type React from "react"

import { LayoutDashboard, Settings, BarChart3, Package, Clock, Pizza } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { appConfig } from "@/config/app.config"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const menuItems = [
    { href: "/admin", icon: LayoutDashboard, label: "Dashboard" },
    { href: "/admin/orders", icon: Clock, label: "Orders" },
    { href: "/admin/menu", icon: Pizza, label: "Menu" },
        { href: "/admin/inventory", icon: Package, label: "Inventory" },
    // { href: "/admin/analytics", icon: BarChart3, label: "Analytics" },
    // { href: "/admin/settings", icon: Settings, label: "Settings" },
  ]

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <aside
        className={`${sidebarOpen ? "w-64" : "w-20"} bg-card border-r border-border transition-all duration-300 flex flex-col`}
      >
        <div className="p-6 flex items-center justify-between">
          {sidebarOpen && <span className="text-lg font-bold text-foreground">{appConfig.name}</span>}
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 hover:bg-muted rounded">
            {sidebarOpen ? "←" : "→"}
          </button>
        </div>

        <nav className="flex-1 space-y-2 px-4">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-foreground hover:bg-muted transition"
            >
              <item.icon className="w-5 h-5" />
              {sidebarOpen && <span className="text-sm">{item.label}</span>}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-border">
          <Button variant="outline" className="w-full text-sm bg-transparent" size="sm">
            {sidebarOpen ? "Logout" : "Exit"}
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-card border-b border-border px-8 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground">Restaurant Admin</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">Admin</span>
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
              <span className="font-bold text-primary">A</span>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  )
}
