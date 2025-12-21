"use client"

import { Star, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useStore } from "@/lib/store"
import Link from "next/link"
import ImageCarousel from "./image-carousel"

interface MenuItem {
  id: number
  name: string
  description: string
  price: number
  rating: number
  images?: string[]
  badge?: string
  reviewCount?: number
}

interface MenuSectionProps {
  title: string
  description: string
  items: MenuItem[]
}

export default function MenuSection({ title, description, items }: MenuSectionProps) {
  const { user, addToCart } = useStore()

  return (
    <div className="space-y-6">
      <div className="space-y-2 pb-4 border-b-3 border-primary/20">
        <h3 className="text-4xl font-bold bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
          {title}
        </h3>
        <p className="text-muted-foreground text-base font-medium">{description}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item) => (
          <div key={item.id} className="menu-card group">
            {/* Image Carousel */}
            <div className="menu-card-image">
              <ImageCarousel images={item.images || []} />
            </div>

            {/* Badge */}
            {item.badge && <div className="menu-card-badge">{item.badge}</div>}

            {/* Content */}
            <div className="menu-card-content">
              <h4 className="menu-card-title group-hover:text-primary transition-colors">{item.name}</h4>
              <p className="menu-card-description">{item.description}</p>

              <div className="menu-card-rating">
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
              </div>

              {/* Footer with price and action */}
              <div className="menu-card-footer">
                <span className="price-tag">₱{item.price.toFixed(2)}</span>

                {user ? (
                  <Button
                    onClick={() => addToCart(item)}
                    className="bg-gradient-to-r from-primary to-accent hover:from-accent hover:to-primary text-primary-foreground font-semibold rounded-full px-4 py-2 shadow-lg transition-all duration-300 hover:shadow-xl"
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
