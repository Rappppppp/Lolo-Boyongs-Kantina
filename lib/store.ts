import { Reservation } from "@/app/types/reservations"
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
  role: "user" | "rider" | "admin"
  firstName: string
  lastName: string
  phoneNumber: string
  streetAddress: string
  barangay: string
}

interface VerificationState {
  email: string
  isVerifying: boolean
}

export interface Category {
  id: number
  name: string
  description: string
}

export type Status = "good" | "low" | "critical"

export interface InventoryItem {
  id: number
  name: string
  unit: string
  current_stock: number
  reorder_level: number | null
  status: Status
}

interface ReservationState {
  reservations: Reservation[];
  setReservations: (res: Reservation[] | ((prev: Reservation[]) => Reservation[])) => void;
  addReservation: (res: Reservation) => void;
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

  // Food Categories
  categories: Category[]
  setCategories: (cats: Category[]) => void
  addCategory: (category: Omit<Category, "id">) => void
  updateCategory: (id: number, updates: Partial<Omit<Category, "id">>) => void
  removeCategory: (id: number) => void

  // Inventory
  inventory: InventoryItem[];
  setInventory: (items: InventoryItem[]) => void;
  addInventory: (item: Omit<InventoryItem, "id">) => void;
  updateInventory: (id: number, updates: Partial<Omit<InventoryItem, "id">>) => void;
  removeInventory: (id: number) => void;

  // FilePond uploads
  filepondFiles: string[] // array of blob strings
  setFilepondFiles: (files: string[]) => void
  addFilepondFile: (file: string) => void
  flushFilepond: () => void
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

      // Item already in cart
      if (existing) {
        // hard stop at 20
        if (existing.quantity >= 20) {
          return state
        }

        return {
          cartItems: state.cartItems.map((i) =>
            i.id === item.id
              ? { ...i, quantity: i.quantity + 1 }
              : i
          ),
        }
      }

      // New item
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
    return subtotal // * 1.12 // 10% tax
  },

  getCartCount: () => {
    return get().cartItems.reduce((sum, item) => sum + item.quantity, 0)
  },

  // Food Categories
  categories: [],
  setCategories: (cats) => set({ categories: cats }), // 🐈 😺
  addCategory: (category) =>
    set((state) => ({
      categories: [...state.categories, { ...category, id: Date.now() }],
    })),

  updateCategory: (id, updates) =>
    set((state) => ({
      categories: state.categories.map((cat) =>
        cat.id === id ? { ...cat, ...updates } : cat
      ),
    })),

  removeCategory: (id) =>
    set((state) => ({
      categories: state.categories.filter((cat) => cat.id !== id),
    })),

  // Inventory
  inventory: [],
  setInventory: (items) => set({ inventory: items }),
  addInventory: (item) =>
    set((state) => ({
      inventory: [...state.inventory, { ...item, id: Date.now() }],
    })),
  updateInventory: (id, updates) =>
    set((state) => ({
      inventory: state.inventory.map((inv) =>
        inv.id === id ? { ...inv, ...updates } : inv
      ),
    })),
  removeInventory: (id) =>
    set((state) => ({
      inventory: state.inventory.filter((inv) => inv.id !== id),
    })),

  // FilePond
  filepondFiles: [],
  setFilepondFiles: (files) => set({ filepondFiles: files }),
  addFilepondFile: (file) =>
    set((state) => ({ filepondFiles: [...state.filepondFiles, file] })),
  flushFilepond: () => set({ filepondFiles: [] }),
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

export const useReservationStore = create<ReservationState>((set) => ({
  reservations: [],
  setReservations: (res) =>
    set((state) => ({ reservations: typeof res === "function" ? res(state.reservations) : res })),
  addReservation: (res) =>
    set((state) => ({ reservations: [res, ...state.reservations] })),
}));