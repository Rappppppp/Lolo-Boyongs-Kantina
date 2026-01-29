"use client"

import { useState } from "react"
import { useMenuItems } from "@/hooks/client/useMenuItems"
import MenuSection from "@/components/menu-section"

export default function MenuPage() {
  const [cartOpen, setCartOpen] = useState(false)
  const { menuItems, loading, error } = useMenuItems()

  // Group menu items by category
  const groupedItems = menuItems.reduce((acc, item) => {
    const key = item.category.toLowerCase().replace(/\s+/g, "_") // e.g., "Appetizers" -> "appetizers"
    if (!acc[key]) acc[key] = []
    acc[key].push(item)
    return acc
  }, {} as Record<string, typeof menuItems>)

  // Optional: friendly descriptions per category
  const categoryDescriptions: Record<string, string> = {
    appetizers: "Exquisite starters to awaken your palate",
    mains: "Our chef's finest creations",
    desserts: "Sweet masterpieces to conclude your meal",
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-gradient-to-r from-primary/5 via-accent/5 to-primary/5 py-12 border-b-3 border-primary/20">
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="text-5xl font-bold mb-3 bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
            Explore Our Menu
          </h1>
          <p className="text-lg text-muted-foreground font-medium max-w-2xl">
            Taste the family tradition and classic flavors of Lolo Boyong’s Kantina.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="flex flex-col lg:flex-row gap-10">
          <div className="flex-1 space-y-16">
            {Object.entries(groupedItems).map(([key, items]) => (
              <MenuSection
                key={key}
                title={items[0]?.category || key}
                description={categoryDescriptions[key] || `Delicious ${items[0]?.category || key}`}
                items={items}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
