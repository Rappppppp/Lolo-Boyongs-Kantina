"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Navigation from "@/components/navigation"
// import MenuSection from "@/components/menu-section"
import OrderCart from "@/components/order-cart"
import Link from "next/link"
import { MapPin, Star, UtensilsCrossed, Utensils, Wallet, ClipboardList, QrCode } from "lucide-react"
import { appConfig } from "@/config/app.config"
import { Dialog } from "@radix-ui/react-dialog"
import { DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import MapDialog from "@/components/map-dialog"
import HomepageGallery from "@/components/homepage-gallery"

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
              <h1 className="text-5xl md:text-7xl font-bold text-balance leading-tight">
                Welcome to <span className="text-primary brightness-150">{appConfig.name}</span>
              </h1>
              <p className="text-xl md:text-2xl text-primary-foreground/90 max-w-2xl text-balance">
                Experience contemporary cuisine crafted by our award-winning chefs using the finest ingredients from
                around the world
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mb-16">
              <Dialog>
                <DialogTrigger asChild>
                  <Button size="lg" variant="default" className="text-lg cursor-pointer">
                    View Featured Menu
                  </Button>
                </DialogTrigger>

                <DialogContent className="w-full sm:max-w-4xl max-h-[95vh] overflow-y-auto ">
                  {/* Accessible title, visually hidden */}
                  <DialogTitle >Featured Menu</DialogTitle>

                  <img
                    src="/resto/featured-menu.jpg"
                    alt="Featured Menu"
                    className="w-full object-cover rounded-lg"
                  />
                </DialogContent>
              </Dialog>


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

      <section className="py-20 bg-background">
        <div className="max-w-6xl mx-auto px-4">
          <div className=" space-y-8">
            {/* Restaurant Info */}
            <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-accent/5">
              <CardContent className="p-8 md:p-12">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <span className="text-primary font-bold text-sm uppercase tracking-wider">Family Restaurant</span>
                    <h3 className="text-3xl md:text-4xl font-bold mt-2">Open Daily</h3>
                    <p className="text-muted-foreground mt-2">
                      Dine-in • Take-out • Delivery • Catering
                    </p>
                  </div>
                  <Utensils className="w-12 h-12 text-primary opacity-20" />
                </div>

                <p className="text-muted-foreground mb-6">
                  Enjoy delicious home-cooked meals perfect for any gathering.
                </p>

                <Button variant="outline" asChild>
                  <Link href="/menu">
                    <ClipboardList className="h-5 w-5" />
                    View Menu Page
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Contact & Location */}
            <Card className="border-2 border-accent/20 bg-gradient-to-br from-accent/5 to-primary/5">
              <CardContent className="p-8 md:p-12">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <span className="text-accent font-bold text-sm uppercase tracking-wider">Visit or Contact Us</span>
                    <h3 className="text-3xl md:text-4xl font-bold mt-2">10am - 8pm</h3>
                    <p className="text-muted-foreground mt-2">Monday – Sunday</p>
                  </div>
                  <MapPin className="w-12 h-12 text-accent opacity-20" />
                </div>

                <div className="space-y-3 text-muted-foreground mb-6">
                  <p>
                    <strong>Email:</strong> {appConfig.email}
                  </p>
                  <p>
                    <strong>Phone:</strong> {appConfig.phone}
                  </p>
                  <p>
                    <strong>Address:</strong><br />
                    {appConfig.address}
                  </p>
                </div>


                <MapDialog />

              </CardContent>
            </Card>

            {/* Payment Options */}
            <Card className="border-2 border-accent/20 bg-gradient-to-br from-accent/5 to-primary/5">
              <CardContent className="p-8 md:p-12">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <span className="text-accent font-bold text-sm uppercase tracking-wider">Payment Options</span>
                    <h3 className="text-3xl md:text-4xl font-bold mt-2">Convenient Payments</h3>
                    <p className="text-muted-foreground mt-2">Choose how you want to settle your bill</p>
                  </div>
                  <Wallet className="w-12 h-12 text-accent opacity-20" />
                </div>

                <div className="space-y-4 mb-6 text-muted-foreground">
                  <div>
                    <h4 className="font-semibold">Split Payment (Reservation)</h4>
                    <p>Pay partial online (e.g., 50% deposit) and the rest in-person upon arrival.</p>
                  </div>

                  <div>
                    <h4 className="font-semibold">Pay After Order (Post-Meal)</h4>
                    <p>Pay online from your phone or pay at the counter.</p>
                  </div>

                  <div>
                    <h4 className="font-semibold">For Delivery</h4>
                    <p>Cash on Delivery or pay in advance online.</p>
                  </div>
                </div>

                <Dialog>
                  <DialogTrigger asChild>
                    <Button size="lg" variant="outline" className="cursor-pointer">
                      <QrCode className="h-5 w-5" />
                      Show QR Payment
                    </Button>
                  </DialogTrigger>

                  <DialogContent
                    className="w-full sm:max-w-5xl max-h-[95vh] overflow-y-auto p-6"
                  >
                    {/* Accessible title */}
                    <DialogTitle>QR Payment</DialogTitle>

                    <div className="grid md:grid-cols-2 gap-6">
                      <img
                        src="/resto/qr-gcash.jpg"
                        alt="GCash QR Payment"
                        className="w-full object-cover shadow-lg rounded-lg"
                      />

                      <img
                        src="/resto/qr-maya.jpg"
                        alt="Maya QR Payment"
                        className="w-full object-cover shadow-lg rounded-lg"
                      />
                    </div>
                  </DialogContent>
                </Dialog>


              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-24 bg-accent/5">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">

            {/* Text Section */}
            <div>
              <span className="text-primary font-semibold tracking-wider uppercase text-sm">
                About Us
              </span>

              <h2 className="text-4xl md:text-5xl font-bold text-foreground mt-2 mb-6">
                Our Story
              </h2>

              <p className="text-muted-foreground leading-relaxed mb-6">
                <span className="font-semibold text-foreground">{appConfig.name} was founded in 2019</span> by husband-and-wife team
                <span className="font-semibold text-foreground"> Mr. Richmond</span> and <span className="font-semibold text-foreground"> Mrs. Joan Bonza</span>.
                Named in honor of Mr. Richmond’s beloved grandfather,
                <span className="font-semibold text-foreground"> “Lolo Boyong”</span>,
                the restaurant stands as a tribute to family, tradition, and good food.
              </p>

              <p className="text-muted-foreground leading-relaxed mb-6">
                What began as a heartfelt passion project has grown into a warm,
                welcoming place where guests can enjoy home-style dishes —
                cooked with the same love and care shared around the Bonza family table.
              </p>
            </div>

            {/* Image Section */}
            <div className="relative h-96 rounded-2xl overflow-hidden shadow-xl bg-gradient-to-br from-primary/10 to-accent/10">
              <img
                src="/resto/1.jpg"
                alt="Founders"
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent" />
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

          <HomepageGallery />
        </div>
      </section>

      {/* Operating Hours & Location */}
      <section className="py-20 bg-accent/5">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-2xl font-bold mb-6">Operating Hours</h3>
              <div className="space-y-3">

                <div className="flex justify-between items-center pb-3 border-b border-border/50">
                  <span className="text-muted-foreground">Monday - Sunday</span>
                  <span className="font-semibold text-foreground">10:00 AM - 8:00 PM</span>
                </div>

                <div className="flex justify-between items-center pb-3 border-b border-border/50">
                  <span className="text-muted-foreground">Holidays</span>
                  <span className="font-semibold text-foreground">Call for details</span>
                </div>

              </div>
            </div>

            <div>
              <h3 className="text-2xl font-bold mb-6">Contact & Location</h3>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <MapPin className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-semibold text-foreground">Address</p>
                    <p className="text-muted-foreground">{appConfig.address}</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <UtensilsCrossed className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-semibold text-foreground mb-2">Get in Touch</p>
                    <p className="text-muted-foreground"><b className="text-sm">Phone:</b> {appConfig.phone}</p>
                    <p className="text-muted-foreground"><b className="text-sm">Email:</b> {appConfig.email}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Map placeholder */}
          <div id="directions" className="mt-12 w-full h-96 bg-gradient-to-br from-primary/10 to-accent/10 rounded-xl overflow-hidden border border-border relative">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d123740.27886220814!2d121.12838740941358!3d14.260026599429095!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3397e389a77cef07%3A0xcb208b11d66e89ed!2sLolo%20boyong&#39;s%20kantina!5e0!3m2!1sen!2sph!4v1764726883893!5m2!1sen!2sph"
              className="absolute inset-0 w-full h-full border-0"
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
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
            <Button size="lg" variant="default" asChild>
              <Link href="/reservations">Book a Table</Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary bg-transparent"
              asChild
            >
              <Link href="/menu">

                View Menu
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Cart Sidebar */}
      <OrderCart isOpen={cartOpen} onClose={() => setCartOpen(false)} />
    </div>
  )
}
