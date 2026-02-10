"use client"

import { useEffect, useRef, useState, useCallback, Fragment } from "react"
import { usePathname, useRouter } from "next/navigation"
import Link from "next/link"
import {
  ShoppingCart,
  Menu as MenuIcon,
  X,
  LogOut,
  Loader2,
  ChevronDown,
} from "lucide-react"
import { Menu, Transition } from "@headlessui/react"

import { Button } from "@/components/ui/button"
import { useStore } from "@/lib/store"
import { appConfig } from "@/config/app.config"
import { useLogout } from "@/hooks/auth/useLogout"
import { useToast } from "@/components/ui/use-toast"
import LogoutModal from "@/components/auth/logout-modal"

interface NavigationProps {
  onCartClick: () => void
}

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/menu", label: "Menu" },
  { href: "/orders", label: "Orders" },
  { href: "/reservations", label: "Reservations" },
  { href: "/#about", label: "About" },
]

export default function Navigation({ onCartClick }: NavigationProps) {
  const { user, getCartCount } = useStore()
  const { loading } = useLogout()
  const { toast } = useToast()
  const router = useRouter()
  const pathname = usePathname()

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [showNavbar, setShowNavbar] = useState(true)

  const cartCount = getCartCount()
  const lastScrollY = useRef(0)
  const ticking = useRef(false)

  /* ------------------------- Active Route Helper ------------------------- */
  const isActive = (href: string) => {
    if (href === "/") return pathname === "/"
    return pathname.startsWith(href)
  }

  /* ------------------------- Scroll Logic (Desktop) ------------------------ */
  useEffect(() => {
    if (window.innerWidth < 768) return

    const onScroll = () => {
      if (ticking.current) return

      ticking.current = true
      requestAnimationFrame(() => {
        const currentY = window.scrollY
        const scrollingDown = currentY > lastScrollY.current

        if (scrollingDown && currentY > 80 && showNavbar) {
          setShowNavbar(false)
        } else if (!scrollingDown && !showNavbar) {
          setShowNavbar(true)
        }

        lastScrollY.current = currentY
        ticking.current = false
      })
    }

    window.addEventListener("scroll", onScroll)
    return () => window.removeEventListener("scroll", onScroll)
  }, [showNavbar])

  /* ---------------------------- Cart Handling ---------------------------- */
  const handleCartClick = useCallback(() => {
    if (cartCount > 0) {
      onCartClick()
      return
    }

    if (pathname.includes("menu")) {
      toast({
        title: "Cart is empty",
        description: "Please select a menu item to proceed",
        className: "bg-yellow-300 text-gray-800 border-yellow-600",
        duration: 3000,
      })
    } else {
      router.push("/menu")
    }
  }, [cartCount, pathname, onCartClick, router, toast])

  return (
    <>
      {/* Mobile Toggle */}
      <div className={`md:hidden fixed top-5 right-5 z-50 bg-transparent backdrop-blur-md border ${mobileMenuOpen ? 'border-none' : 'border-primary'} p-1 rounded-lg cursor-pointer`} onClick={() => setMobileMenuOpen(v => !v)}>
        {mobileMenuOpen ? (
          <X className="text-white w-6 h-6" />
        ) : (
          <MenuIcon className="text-primary w-6 h-6" />
        )}
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden fixed top-0 left-0 w-full h-screen bg-linear-to-br from-primary to-orange-400 text-white z-40 transition-transform duration-300 ${mobileMenuOpen ? "translate-x-0" : "translate-x-full"
          }`}
      >
        <div className="flex flex-col items-center justify-center h-full gap-6 text-xl">
          {NAV_LINKS.map(link => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="hover:opacity-80"
            >
              {link.label}
            </Link>
          ))}

          {user && user.role !== "rider" && (
            <button onClick={handleCartClick} className="mt-4">
              Cart ({cartCount})
            </button>
          )}

          {user ? (
            <LogoutModal>
              <button
                disabled={loading}
                className="mt-4"
                onClick={() => setMobileMenuOpen(false)}
              >
                {loading ? "Logging out..." : "Logout"}
              </button>
            </LogoutModal>
          ) : (
            <div className="flex flex-col gap-2 mt-4">
              <Link href="/login" onClick={() => setMobileMenuOpen(false)}>Sign In</Link>
              <Link href="/register" onClick={() => setMobileMenuOpen(false)}>Sign Up</Link>
            </div>
          )}
        </div>
      </div>

      <nav
        className={[
          "sticky top-0 z-50 hidden md:block",
          "bg-gradient-to-br from-primary to-orange-400",
          "text-white shadow-sm transition-transform duration-300",
          showNavbar ? "translate-y-0" : "-translate-y-full",
        ].join(" ")}
      >
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 hover:opacity-80">
            <img
              src="/app-logo.jpg"
              alt={appConfig.name}
              className="w-12 h-12 rounded-full"
            />
            <h1 className="text-xl">{appConfig.name}</h1>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-8">
            {user?.role === "admin" && (
              <Link href="/admin" className="relative group font-medium">
                <h3>Admin</h3>
                <span className="absolute left-0 -bottom-1 h-[2px] w-full bg-white origin-left scale-x-0 transition-transform group-hover:scale-x-100" />
              </Link>
            )}

            {NAV_LINKS.map(link => {
              const active = isActive(link.href)

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="relative group font-medium"
                >
                  <h3>{link.label}</h3>
                  <span
                    className={[
                      "absolute left-0 -bottom-1 h-[2px] w-full bg-white",
                      "origin-left scale-x-0 transition-transform duration-300",
                      "group-hover:scale-x-100",
                      active && "scale-x-100",
                    ].join(" ")}
                  />
                </Link>
              )
            })}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4">
            {user && user.role !== "rider" && (
              <Button
                // variant="outline"
                size="icon"
                onClick={handleCartClick}
                className={`relative ${cartCount > 0 ? "bg-red-700" : "bg-transparent"}`}
              >
                <ShoppingCart className="w-5 h-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 w-5 h-5 text-xs font-bold rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Button>
            )}

            {/* User Dropdown */}
            {user ? (
              <Menu as="div" className="relative">
                <Menu.Button className="flex items-center gap-2 px-3 py-2">
                  <span className="font-medium">{user.first_name}</span>
                  <ChevronDown className="w-4 h-4" />
                </Menu.Button>

                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-100"
                  enterFrom="opacity-0 scale-95"
                  enterTo="opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="opacity-100 scale-100"
                  leaveTo="opacity-0 scale-95"
                >
                  <Menu.Items className="absolute right-0 mt-2 w-56 rounded-xl bg-white text-gray-800 shadow-lg focus:outline-none overflow-hidden">
                    <div className="px-4 py-3 border-b">
                      <p className="text-sm font-medium">{user.first_name}</p>
                      <p className="text-xs text-gray-500 truncate">
                        {user.email}
                      </p>
                    </div>

                    <Menu.Item>
                      {() => (
                        <LogoutModal>
                          <button
                            disabled={loading}
                            className="w-full px-4 py-2 flex items-center gap-2 text-sm text-red-600 hover:bg-red-50 transition"
                          >
                            {loading
                              ? <Loader2 className="w-4 h-4 animate-spin" />
                              : <LogOut className="w-4 h-4" />}
                            Logout
                          </button>
                        </LogoutModal>
                      )}
                    </Menu.Item>
                  </Menu.Items>
                </Transition>
              </Menu>
            ) : (
              <div className="hidden md:flex gap-2">
                <Button className="bg-transparent" asChild>
                  <Link href="/login">Sign In</Link>
                </Button>
                <Button asChild>
                  <Link href="/register">Sign Up</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </nav>
    </>
  )
}