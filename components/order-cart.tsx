"use client"

import { X, Trash2, CheckCircle, Plus, Minus } from "lucide-react"
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useStore } from "@/lib/store"
import Link from "next/link"
import { useEffect } from "react"

interface OrderCartProps {
  isOpen: boolean
  onClose: () => void
}

export default function OrderCart({ isOpen, onClose }: OrderCartProps) {
  const { cartItems, removeFromCart, updateQuantity, getCartTotal } = useStore()
  const total = getCartTotal()
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)

  useEffect(() => {
    if (cartItems.length === 0) {
      onClose()
    }
  }, [cartItems, onClose])

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
        // not working in mac
          className="fixed inset-0 bg-black/80 z-[9998]"
          onClick={onClose}
        />
      )}

      {/* Cart */}
      <div
        className={`fixed right-0 top-0 z-[9999] h-screen w-full md:w-96
        bg-card border-l border-border shadow-lg
        transform transition-transform duration-300
        ${isOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="h-full flex flex-col overflow-auto">
          <CardHeader className="p-5 border-b border-border flex items-center justify-between">
            <CardTitle>Order Summary</CardTitle>
            <button onClick={onClose}>
              <X className="w-5 h-5 cursor-pointer" />
            </button>
          </CardHeader>

          <CardContent className="flex-1 overflow-auto p-6 space-y-4">
            {cartItems.length === 0 ? (
              <div className="text-center py-12">
                <CheckCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                <p className="text-muted-foreground">Your cart is empty</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Add items from the menu to get started
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between bg-muted/30 p-3 rounded-lg"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm">{item.name}</p>
                      <p className="text-primary font-semibold">
                        ₱ {(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 ml-2">
                      <Button
                        size="icon"
                        variant="outline"
                        className={`w-6 h-6 bg-transparent ${item.quantity <= 1 && "opacity-50"}`}
                        disabled={item.quantity <= 1}
                        onClick={() => {
                          if (item.quantity >= 1) {
                            updateQuantity(item.id, item.quantity - 1)
                          }
                        }}
                      >
                        <Minus className="w-3 h-3" />
                      </Button>

                      <span className="w-6 text-center text-sm font-medium">
                        {item.quantity}
                      </span>

                      <Button
                        size="icon"
                        variant="outline"
                        className="w-6 h-6 bg-transparent"
                        disabled={item.quantity >= 20}
                        onClick={() => {
                          if (item.quantity < 20) {
                            updateQuantity(item.id, item.quantity + 1)
                          }
                        }}
                      >
                        <Plus className="w-3 h-3" />
                      </Button>

                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="ml-2 p-1 hover:bg-destructive/10 rounded text-destructive transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>

          {cartItems.length > 0 && (
            <div className="border-t border-border p-6 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-medium">₱ {subtotal.toFixed(2)}</span>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Tax (12%)</span>
                <span className="font-medium">
                  ₱ {(total - subtotal).toFixed(2)}
                </span>
              </div>

              <div className="flex justify-between text-base font-bold border-t border-border pt-3">
                <span>Total</span>
                <span className="text-primary">₱ {total.toFixed(2)}</span>
              </div>

              <Button className="w-full" size="lg" asChild>
                <Link href="/checkout">Proceed to Checkout</Link>
              </Button>

              <Button
                variant="outline"
                className="w-full bg-transparent"
                onClick={onClose}
              >
                Continue Shopping
              </Button>
            </div>
          )}
        </div>
      </div>
    </>
  )
}