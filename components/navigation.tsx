"use client"

import { ShoppingCart, Menu, X, LogOut, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { useStore } from "@/lib/store"
import Link from "next/link"
import { appConfig } from "@/config/app.config"

interface NavigationProps {
  onCartClick: () => void
}

export default function Navigation({ onCartClick }: NavigationProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { user, setUser, getCartCount } = useStore()
  const cartCount = getCartCount()

  const handleLogout = () => {
    setUser(null)
  }

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-border shadow-sm">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        
        <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition">
          <img src="/app-logo.jpg" alt="Lolo Boyong's Kantina" className="w-12 h-12 rounded-full" />
          <span className="text-xl font-bold text-foreground">{appConfig.name}</span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <Link href="/" className="text-foreground hover:text-primary transition font-medium">
            Home
          </Link>
          <Link href="/menu" className="text-foreground hover:text-primary transition font-medium">
            Menu
          </Link>
          <Link href="/reservations" className="text-foreground hover:text-primary transition font-medium">
            Reservations
          </Link>
          <Link href="/#about" className="text-foreground hover:text-primary transition font-medium">
            About
          </Link>
        </div>

        <div className="flex items-center gap-4">
          {user && (
            <Button variant="outline" size="icon" onClick={onCartClick} className="relative bg-transparent">
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                  {cartCount}
                </span>
              )}
            </Button>
          )}

          {user ? (
            <div className="hidden md:flex items-center gap-2">
              <Button variant="outline" size="sm" asChild>
                <Link href="/profile" className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  {user.name}
                </Link>
              </Button>
              <Button variant="ghost" size="icon" onClick={handleLogout}>
                <LogOut className="w-5 h-5" />
              </Button>
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-2">
              <Button variant="outline" asChild>
                <Link href="/login">Sign In</Link>
              </Button>
              <Button asChild>
                <Link href="/register">Sign Up</Link>
              </Button>
            </div>
          )}

          <button className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-card">
          <div className="px-4 py-4 space-y-4">
            <Link href="/" className="block text-foreground hover:text-primary font-medium">
              Home
            </Link>
            <Link href="/menu" className="block text-foreground hover:text-primary font-medium">
              Menu
            </Link>
            <Link href="/reservations" className="block text-foreground hover:text-primary font-medium">
              Reservations
            </Link>
            <Link href="/about" className="block text-foreground hover:text-primary font-medium">
              About
            </Link>
            {user && (
              <>
                <Link href="/profile" className="block text-foreground hover:text-primary font-medium">
                  Profile
                </Link>
                <Button variant="ghost" className="w-full justify-start" onClick={handleLogout}>
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </>
            )}
            {!user && (
              <>
                <Link href="/login" className="block">
                  <Button variant="outline" className="w-full bg-transparent">
                    Sign In
                  </Button>
                </Link>
                <Link href="/register" className="block">
                  <Button className="w-full">Sign Up</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}
