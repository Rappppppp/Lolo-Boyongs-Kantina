"use client"

import { appConfig } from "@/config/app.config";
import Navigation from "@/components/navigation"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation onCartClick={() => {}} />

      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-6">About {appConfig.name}</h1>

        <div className="prose prose-invert max-w-none space-y-6 text-foreground">
          <section className="space-y-3">
            <h2 className="text-2xl font-bold">Our Story</h2>
            <p className="text-muted-foreground">
              Founded in 2015, {appConfig.name} has been a beacon of authentic culinary excellence in the heart of downtown. Our
              chefs blend traditional techniques with contemporary innovation to create unforgettable dining
              experiences.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-bold">Our Mission</h2>
            <p className="text-muted-foreground">
              To celebrate the art of cooking by sourcing the finest ingredients and delivering exceptional service that
              makes every meal a cherished memory.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-bold">Our Chef</h2>
            <p className="text-muted-foreground">
              Chef Marcus leads our kitchen with 20+ years of experience in Michelin-starred establishments across
              Europe. His passion for gastronomy and commitment to quality drives every plate that leaves our kitchen.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-bold">Why Choose Us</h2>
            <ul className="space-y-2 text-muted-foreground">
              <li>✓ Premium quality ingredients sourced locally and internationally</li>
              <li>✓ Expert chefs with decades of combined experience</li>
              <li>✓ Elegant ambiance perfect for any occasion</li>
              <li>✓ Personalized service and attention to detail</li>
              <li>✓ Innovative menu updated seasonally</li>
            </ul>
          </section>

          <div className="flex gap-4 pt-6">
            <Button asChild>
              <Link href="/menu">View Menu</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/reservations">Reserve Now</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
