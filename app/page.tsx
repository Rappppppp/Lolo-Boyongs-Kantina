"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Navigation from "@/components/navigation"
import MenuSection from "@/components/menu-section"
import OrderCart from "@/components/order-cart"
import Link from "next/link"
import { Clock, MapPin, Star, Users, UtensilsCrossed, Flame } from "lucide-react"
import { appConfig } from "@/config/app.config"

export default function Home() {
  const [cartOpen, setCartOpen] = useState(false)

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Food Enthusiast",
      content: "The most exquisite dining experience. Every dish is a masterpiece.",
      rating: 5,
      image: "/testimonial-woman.jpg",
    },
    {
      name: "James Wilson",
      role: "Restaurant Critic",
      content: "Exceptional flavors combined with impeccable service. Highly recommended!",
      rating: 5,
      image: "/testimonial-man.jpg",
    },
    {
      name: "Maria Garcia",
      role: "Regular Customer",
      content: "A culinary journey that transforms dining into art. Simply magical.",
      rating: 5,
      image: "/testimonial-woman-2.jpg",
    },
  ]

  const galleryImages = [
    { title: "Signature Dish", query: "gourmet-plated-food" },
    { title: "Restaurant Interior", query: "fine-dining-ambiance" },
    { title: "Chef Preparation", query: "chef-cooking" },
    { title: "Table Setting", query: "elegant-table-setup" },
    { title: "Dessert Showcase", query: "gourmet-dessert" },
    { title: "Bar Area", query: "luxury-bar-setting" },
  ]

  return (
    <div className="min-h-screen bg-background">
      <Navigation onCartClick={() => setCartOpen(!cartOpen)} />

      {/* Hero Section */}
      <section className="relative min-h-screen bg-black text-primary-foreground overflow-hidden">
        
        <img src="/hero-bg.jpg" alt="Lolo Boyong's Kantina" className="absolute inset-0 w-full h-full object-cover opacity-50 blur-sm" />
        
        {/* Decorative elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-white rounded-full mix-blend-multiply filter blur-xl"></div>
          <div className="absolute bottom-20 right-10 w-72 h-72 bg-white rounded-full mix-blend-multiply filter blur-xl"></div>
        </div>

        <div className="relative max-w-6xl mx-auto px-4 py-24 md:py-32 flex items-center min-h-screen">
          <div className="w-full">
            <div className="space-y-6 mb-12">
              <div className="inline-block">
                <span className="px-4 py-2 bg-white/10 border border-white/20 rounded-full text-sm font-medium backdrop-blur-sm">
                  We are open from <b className="text-primary brightness-150">Monday to Sunday</b> 📅 | <b className="text-primary brightness-150">9:00 AM - 8:00 PM</b> ⏰
                </span>
              </div>
              <h1 className="text-5xl md:text-7xl font-bold text-balance leading-tight">
                Welcome to <span className="text-primary brightness-150">{appConfig.name}</span>
              </h1>
              <p className="text-xl md:text-2xl text-primary-foreground/90 max-w-2xl text-balance">
                Experience contemporary cuisine crafted by our award-winning chefs using the finest ingredients from
                around the world
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mb-16">
              <Button size="lg" variant="secondary" asChild className="text-lg">
                <Link href="/menu">Explore Menu</Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary bg-transparent text-lg"
                asChild
              >
                <Link href="/reservations">Reserve Table</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Menu Section */}
      <section className="py-20 bg-background">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <span className="text-primary font-semibold text-sm">CULINARY CREATIONS</span>
            <h2 className="text-4xl md:text-5xl font-bold mt-2 mb-4">Featured Dishes</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Discover our most celebrated creations, crafted with passion and precision
            </p>
          </div>

          <div className="space-y-12">
            <MenuSection
              title="Appetizers"
              description="Begin your culinary journey with our signature starters"
              items={[
                {
                  id: 1,
                  name: "Truffle Dumplings",
                  description: "Handmade dumplings with black truffle oil, served with soy reduction",
                  price: 12.99,
                  rating: 4.9,
                },
                {
                  id: 2,
                  name: "Crispy Spring Rolls",
                  description: "Golden rolls filled with vegetables and shrimp, sweet chili sauce",
                  price: 8.99,
                  rating: 4.7,
                },
              ]}
            />

            <MenuSection
              title="Main Courses"
              description="Our chef's finest creations"
              items={[
                {
                  id: 4,
                  name: "Pan-Seared Salmon",
                  description: "Atlantic salmon with lemon beurre blanc and seasonal vegetables",
                  price: 24.99,
                  rating: 4.9,
                },
                {
                  id: 5,
                  name: "Wagyu Beef Steak",
                  description: "Prime cut with truffle mashed potatoes and red wine reduction",
                  price: 32.99,
                  rating: 5.0,
                },
              ]}
            />
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 bg-accent/5">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-primary font-semibold text-sm">OUR STORY</span>
              <h2 className="text-4xl font-bold mt-2 mb-6">Celebrating {appConfig.name} Artistry</h2>
              <p className="text-muted-foreground text-lg mb-4">
                Founded in 2015, {appConfig.name} has become a beacon of gastronomic excellence. Our journey began with a simple
                vision: to transform dining into an unforgettable experience through innovative cuisine and exceptional
                service.
              </p>
              <p className="text-muted-foreground text-lg mb-8">
                Led by Chef Marcus, our team brings together decades of combined culinary expertise from
                Michelin-starred kitchens around the world. Every plate tells a story of passion, precision, and
                dedication to the craft.
              </p>
              <Button asChild>
                <Link href="/about">Learn More About Us</Link>
              </Button>
            </div>
            <div className="relative h-96 bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl overflow-hidden">
              <img src="/chef-portrait.jpg" alt="Chef Marcus" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-background">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <span className="text-primary font-semibold text-sm">GUEST REVIEWS</span>
            <h2 className="text-4xl md:text-5xl font-bold mt-2 mb-4">What Our Guests Say</h2>
            <p className="text-muted-foreground text-lg">Exceptional experiences from our valued patrons</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-border hover:shadow-lg transition">
                <CardContent className="p-8">
                  <div className="flex gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-foreground mb-6 text-lg italic">"{testimonial.content}"</p>
                  <div className="flex items-center gap-4">
                    <img
                      src={testimonial.image || "/placeholder.svg"}
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full"
                    />
                    <div>
                      <div className="font-semibold text-foreground">{testimonial.name}</div>
                      <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="py-20 bg-accent/5">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <span className="text-primary font-semibold text-sm">VISUAL FEAST</span>
            <h2 className="text-4xl md:text-5xl font-bold mt-2 mb-4">Restaurant Gallery</h2>
            <p className="text-muted-foreground text-lg">Experience our ambiance and culinary artistry</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {galleryImages.map((image, index) => (
              <div key={index} className="group relative h-80 rounded-xl overflow-hidden cursor-pointer">
                <img
                  src={`/.jpg?height=320&width=400&query=${image.query}`}
                  alt={image.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition flex items-end p-6">
                  <h3 className="text-white font-semibold text-lg">{image.title}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Special Offers Section */}
      <section className="py-20 bg-background">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-accent/5">
              <CardContent className="p-8 md:p-12">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <span className="text-primary font-bold text-sm uppercase tracking-wider">Limited Time Offer</span>
                    <h3 className="text-3xl md:text-4xl font-bold mt-2">20% Off</h3>
                    <p className="text-muted-foreground mt-2">For First-Time Diners</p>
                  </div>
                  <Flame className="w-12 h-12 text-primary opacity-20" />
                </div>
                <p className="text-muted-foreground mb-6">
                  Use code WELCOME20 at checkout. Valid for dine-in reservations only.
                </p>
                <Button asChild>
                  <Link href="/menu">Claim Offer</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="border-2 border-accent/20 bg-gradient-to-br from-accent/5 to-primary/5">
              <CardContent className="p-8 md:p-12">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <span className="text-accent font-bold text-sm uppercase tracking-wider">Exclusive Program</span>
                    <h3 className="text-3xl md:text-4xl font-bold mt-2">VIP Membership</h3>
                    <p className="text-muted-foreground mt-2">Rewards & Benefits</p>
                  </div>
                  <Users className="w-12 h-12 text-accent opacity-20" />
                </div>
                <p className="text-muted-foreground mb-6">
                  Join our exclusive membership and enjoy special perks, early reservations, and curated experiences.
                </p>
                <Button variant="outline" asChild>
                  <Link href="/reservations">Learn More</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Operating Hours & Location */}
      <section className="py-20 bg-accent/5">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-2xl font-bold mb-6">Operating Hours</h3>
              <div className="space-y-3">
                {[
                  { day: "Monday - Thursday", hours: "5:00 PM - 11:00 PM" },
                  { day: "Friday - Saturday", hours: "5:00 PM - 12:00 AM" },
                  { day: "Sunday", hours: "5:00 PM - 10:00 PM" },
                  { day: "Holidays", hours: "Call for details" },
                ].map((item, i) => (
                  <div key={i} className="flex justify-between items-center pb-3 border-b border-border/50">
                    <span className="text-muted-foreground">{item.day}</span>
                    <span className="font-semibold text-foreground">{item.hours}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-2xl font-bold mb-6">Contact & Location</h3>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <MapPin className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-semibold text-foreground">Downtown Restaurant</p>
                    <p className="text-muted-foreground">123 Culinary Lane, Downtown, City 12345</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <UtensilsCrossed className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-semibold text-foreground mb-2">Get in Touch</p>
                    <p className="text-muted-foreground">Phone: (555) 123-4567</p>
                    <p className="text-muted-foreground">Email: hello@culinary.com</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Map placeholder */}
          <div className="mt-12 w-full h-96 bg-gradient-to-br from-primary/10 to-accent/10 rounded-xl overflow-hidden border border-border">
            <img src="/restaurant-location-map.jpg" alt="Restaurant Location" className="w-full h-full object-cover" />
          </div>
        </div>
      </section>

      {/* CTA Footer */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready for an Unforgettable Experience?</h2>
          <p className="text-lg text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
            Reserve your table today and join us for an evening of culinary excellence
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" asChild>
              <Link href="/reservations">Book a Table</Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary bg-transparent"
              asChild
            >
              <Link href="/menu">View Menu</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Cart Sidebar */}
      <OrderCart isOpen={cartOpen} onClose={() => setCartOpen(false)} />
    </div>
  )
}
