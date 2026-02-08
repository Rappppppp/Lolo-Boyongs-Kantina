"use client"

import { Star, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useStore } from "@/lib/store"
import Link from "next/link"
import ImageCarousel from "./image-carousel"

import { toast } from "sonner"

interface MenuImage {
  path: string
  alt_text?: string
  sort_order?: number
  is_featured?: boolean
}

interface MenuItem {
  id: number
  name: string
  description: string
  price: number
  rating: number
  images?: MenuImage[]
  badge?: string
  reviewCount?: number
}

interface MenuSectionProps {
  title: string
  description: string
  items?: MenuItem[]// make optional for loading
  loading?: boolean
  error?: string

}

export default function MenuSection({ title, description, items = [], loading, error }: MenuSectionProps) {
  const { user, addToCart } = useStore()

  if (error) {
    return (
      <div className="p-4 border rounded-lg bg-destructive/10 text-destructive font-semibold">
        Failed to load {title}: {error}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2 pb-4 border-b-3 border-primary/20">
        <h3 className="text-4xl font-bold bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
          {title}
        </h3>
        <p className="text-muted-foreground text-base font-medium">{description}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading
          ? Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="animate-pulse border rounded-lg p-4 space-y-3 bg-muted/50 h-80" />
          ))
          : items.map((item) => (
            <div key={item.id} className="menu-card group">
              {/* Image Carousel */}
              <div >
                <ImageCarousel images={item.images?.filter(i => i.path).map(i => i.path) || []} />
              </div>

              {/* Badge */}
              {item.badge && <div className="menu-card-badge">{item.badge}</div>}

              {/* Content */}
              <div className="menu-card-content">
                <h4 className="menu-card-title group-hover:text-primary transition-colors">{item.name}</h4>
                <p className="menu-card-description">{item.description}</p>

                {item.rating && <div className="menu-card-rating shadow-xl border">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${i < Math.floor(item.rating) ? "fill-accent text-accent" : "text-muted"}`}
                      />
                    ))}
                  </div>
                  <span className="font-bold text-foreground text-sm">{item.rating}</span>
                  {item.reviewCount && <span className="text-xs text-muted-foreground">({item.reviewCount})</span>}
                </div>}

                {/* Footer with price and action */}
                <div className="menu-card-footer flex items-center justify-between gap-2 text-sm text-muted-foreground">
                  <h2 className="price-tag text-primary text-3xl font-bold">₱{item.price}</h2>

                  {user ? (
                    <Button
                      onClick={() => {
                        addToCart(item)
                        toast.success(`${item.name} added to cart`, { position: "bottom-left" })
                      }}
                      className="bg-gradient-to-r from-primary to-accent font-semibold rounded-full px-4 py-2 shadow-lg transition-all duration-300 hover:shadow-xl cursor-pointer"
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Add
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      className="rounded-full px-4 py-2 border-2 border-primary hover:bg-primary hover:text-primary-foreground transition-all bg-transparent"
                      asChild
                    >
                      <Link href="/login">
                        <Plus className="w-4 h-4 mr-1" />
                        Login
                      </Link>
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  )
}
