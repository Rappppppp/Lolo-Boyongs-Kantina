import { create } from "zustand"

interface CartItem {
  id: number
  name: string
  description: string
  price: number
  rating: number
  quantity: number
}

interface User {
  id: string
  email: string
  firstName: string
  lastName: string
}

interface VerificationState {
  email: string
  isVerifying: boolean
}

interface Store {
  // Auth
  user: User | null
  setUser: (user: User | null) => void

  verification: VerificationState
  setVerification: (email: string) => void
  clearVerification: () => void

  // Cart
  cartItems: CartItem[]
  addToCart: (item: Omit<CartItem, "quantity">) => void
  removeFromCart: (itemId: number) => void
  updateQuantity: (itemId: number, quantity: number) => void
  clearCart: () => void
  getCartTotal: () => number
  getCartCount: () => number
}

export const useStore = create<Store>((set, get) => ({
  // User
  user: null,
  setUser: (user) => set({ user }),

  verification: { email: "", isVerifying: false },
  setVerification: (email) => set({ verification: { email, isVerifying: true } }),
  clearVerification: () => set({ verification: { email: "", isVerifying: false } }),

  cartItems: [],

  addToCart: (item) =>
    set((state) => {
      const existing = state.cartItems.find((i) => i.id === item.id)
      if (existing) {
        return {
          cartItems: state.cartItems.map((i) => (i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i)),
        }
      }
      return {
        cartItems: [...state.cartItems, { ...item, quantity: 1 }],
      }
    }),

  removeFromCart: (itemId) =>
    set((state) => ({
      cartItems: state.cartItems.filter((item) => item.id !== itemId),
    })),

  updateQuantity: (itemId, quantity) =>
    set((state) => ({
      cartItems: state.cartItems
        .map((item) => (item.id === itemId ? { ...item, quantity: Math.max(0, quantity) } : item))
        .filter((item) => item.quantity > 0),
    })),

  clearCart: () => set({ cartItems: [] }),

  getCartTotal: () => {
    const state = get()
    const subtotal = state.cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
    return subtotal * 1.1 // 10% tax
  },

  getCartCount: () => {
    return get().cartItems.reduce((sum, item) => sum + item.quantity, 0)
  },
}))

// Session State
interface SessionState {
  ttl: number | null      // expiration timestamp (ms)
  setTTL: (expiresInSec: number) => void
  clearTTL: () => void
}

export const useSessionStore = create<SessionState>((set) => ({
  ttl: null,
  setTTL: (expiresInSec) => {
    const now = Date.now()
    const expiration = now + expiresInSec * 1000
    set({ ttl: expiration })
  },
  clearTTL: () => set({ ttl: null }),
}))