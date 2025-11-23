"use client"

import { useState } from "react"
import Navigation from "@/components/navigation"
import MenuSection from "@/components/menu-section"
import OrderCart from "@/components/order-cart"

export default function MenuPage() {
  const [cartOpen, setCartOpen] = useState(false)

  const menuItems = {
    appetizers: [
      {
        id: 1,
        name: "Truffle Dumplings",
        description:
          "Delicate handmade dumplings infused with luxurious truffle oil, served with silky mushroom sauce. A sophisticated start to your culinary journey.",
        price: 12.99,
        rating: 4.9,
        reviewCount: 342,
        badge: "Chef's Choice",
        images: ["/truffle-dumplings-asian-food.jpg", "/gourmet-dumplings-cuisine.jpg", "/luxury-dumpling-plating.jpg"],
      },
      {
        id: 2,
        name: "Crispy Spring Rolls",
        description:
          "Golden-brown spring rolls bursting with fresh vegetables and protein, paired with our signature sweet chili sauce and pickled ginger.",
        price: 8.99,
        rating: 4.7,
        reviewCount: 287,
        badge: "Popular",
        images: ["/crispy-spring-rolls.jpg", "/asian-spring-rolls.jpg", "/spring-rolls-sauce.jpg"],
      },
      {
        id: 3,
        name: "Bruschetta Board",
        description:
          "A stunning assortment of Italian-inspired bruschettas on toasted ciabatta, featuring heirloom tomatoes, burrata, and aged balsamic reduction.",
        price: 10.99,
        rating: 4.8,
        reviewCount: 315,
        images: ["/bruschetta-board-appetizer.jpg", "/italian-bruschetta-plating.jpg", "/gourmet-bruschetta.jpg"],
      },
    ],
    mains: [
      {
        id: 4,
        name: "Pan-Seared Salmon",
        description:
          "Pristine Atlantic salmon with a perfect crispy skin, complemented by seasonal vegetables and a delicate lemon-dill beurre blanc.",
        price: 24.99,
        rating: 4.9,
        reviewCount: 428,
        badge: "Signature",
        images: ["/pan-seared-salmon-fish.jpg", "/fine-dining-salmon.jpg", "/salmon-plating-restaurant.jpg"],
      },
      {
        id: 5,
        name: "Wagyu Beef Steak",
        description:
          "Premium Japanese Wagyu beef, grilled to perfection with truffle mashed potatoes, crispy bacon, and a rich red wine reduction.",
        price: 32.99,
        rating: 5.0,
        reviewCount: 512,
        badge: "Premium",
        images: ["/wagyu-beef-steak-luxury.jpg", "/fine-dining-steak-plating.jpg", "/premium-wagyu-meat.jpg"],
      },
      {
        id: 6,
        name: "Vegetarian Wellington",
        description:
          "An elegant celebration of vegetables with a medley of mushrooms in a savory duxelles, encased in buttery puff pastry with herb sauce.",
        price: 18.99,
        rating: 4.6,
        reviewCount: 201,
        images: [
          "/placeholder.svg?height=300&width=400",
          "/placeholder.svg?height=300&width=400",
          "/placeholder.svg?height=300&width=400",
        ],
      },
    ],
    desserts: [
      {
        id: 7,
        name: "Chocolate Lava Cake",
        description:
          "A decadent masterpiece of dark chocolate with a molten center, served with premium vanilla ice cream and fresh berries.",
        price: 8.99,
        rating: 4.9,
        reviewCount: 589,
        badge: "Must Try",
        images: [
          "/placeholder.svg?height=300&width=400",
          "/placeholder.svg?height=300&width=400",
          "/placeholder.svg?height=300&width=400",
        ],
      },
      {
        id: 8,
        name: "Passion Fruit Panna Cotta",
        description:
          "A silky, luxurious Italian custard infused with fresh passion fruit, topped with fruit compote and edible flowers for an unforgettable finish.",
        price: 7.99,
        rating: 4.8,
        reviewCount: 356,
        images: [
          "/placeholder.svg?height=300&width=400",
          "/placeholder.svg?height=300&width=400",
          "/placeholder.svg?height=300&width=400",
        ],
      },
    ],
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation onCartClick={() => setCartOpen(!cartOpen)} />

      <div className="bg-gradient-to-r from-primary/5 via-accent/5 to-primary/5 py-12 border-b-3 border-primary/20">
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="text-5xl font-bold mb-3 bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
            Our Culinary Collection
          </h1>
          <p className="text-lg text-muted-foreground font-medium max-w-2xl">
            Discover exquisitely crafted dishes prepared with premium ingredients and culinary passion
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="flex flex-col lg:flex-row gap-10">
          <div className="flex-1 space-y-16">
            <MenuSection
              title="Appetizers"
              description="Exquisite starters to awaken your palate"
              items={menuItems.appetizers}
            />
            <MenuSection title="Main Courses" description="Our chef's finest creations" items={menuItems.mains} />
            <MenuSection
              title="Desserts"
              description="Sweet masterpieces to conclude your meal"
              items={menuItems.desserts}
            />
          </div>

          <OrderCart isOpen={cartOpen} onClose={() => setCartOpen(false)} />
        </div>
      </div>
    </div>
  )
}
