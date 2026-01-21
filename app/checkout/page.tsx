"use client"

import type React from "react"

import { useState } from "react"
import { Lock, CreditCard, PhilippinePeso } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Navigation from "@/components/navigation"

import { useStore } from "@/lib/store"
import { useCheckout } from "@/hooks/client/useCheckout"

import { toast } from "sonner"
import { set } from "date-fns"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

export default function CheckoutPage() {
  const { cartItems, getCartTotal, user } = useStore();
  const { checkout } = useCheckout();

  // Change to GCash only
  // const [paymentMethod, setPaymentMethod] = useState("card")

  const [processing, setProcessing] = useState(false)
  const [completed, setCompleted] = useState(false)
  const [orderNumber, setOrderNumber] = useState("")

  // Form Fields
  const [fullName, setFullName] = useState(`${user?.firstName ?? ""} ${user?.lastName ?? ""}`)
  const [email, setEmail] = useState(user?.email ?? "")
  const [phoneNumber, setPhoneNumber] = useState(user?.phoneNumber ?? "")
  const [address, setAddress] = useState(
    `${user?.streetAddress ?? ""}, ${user?.barangay ?? ""}`
  )
  const [notes, setNotes] = useState("")
  const [gcashRef, setGcashRef] = useState("")

  // Sample order data - would come from cart state
  const total = getCartTotal()
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setProcessing(true)

    const payload = {
      fullName,
      email,
      phoneNumber,
      address,
      notes,
      gcashRef,
      items: cartItems,
    }

    try {
      const res = await checkout(payload);

      setProcessing(false)
      setCompleted(true);
      setOrderNumber(res.order.order_id)
      toast.success("Order placed successfully.")
    } catch (e) {
      toast.error("System Error. Failed to checkout.")
      console.error(e)
    }
  }

  if (completed) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation onCartClick={() => { }} />
        <div className="max-w-2xl mx-auto px-4 py-12 text-center">
          <div className="bg-green-50 border-2 border-green-200 rounded-lg p-12">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-green-900 mb-4">Order #{orderNumber} Confirmed!</h1>
            <p className="text-lg text-green-800 mb-2">Your order has been successfully placed</p>
            <p className="text-green-700 mb-8">Estimated delivery: 30 minutes</p>
            <Button size="lg" onClick={() => (window.location.href = "/")}>
              Return to Home
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation onCartClick={() => { }} />

      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-foreground mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Payment Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Delivery Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Delivery Address</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Input
                    defaultValue={`${user?.firstName} ${user?.lastName}`}
                    placeholder="Full Name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                  />
                  <Input
                    defaultValue={user?.email}
                    placeholder="Email Address" type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <Input
                    defaultValue={user?.phoneNumber}
                    placeholder="Phone Number" type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    required
                  />
                  <Input
                    defaultValue={`${user?.streetAddress}, ${user?.barangay}`}
                    placeholder="Street Address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    required
                  />
                  <Textarea
                    placeholder="Notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    required
                  />
                </CardContent>
              </Card>

              {/* Terms */}
              <div className="flex gap-3">
                <input type="checkbox" id="terms" className="w-5 h-5 rounded" required />
                <label htmlFor="terms" className="text-sm text-muted-foreground">
                  I agree to the terms and conditions and privacy policy
                </label>
              </div>

              <Button type="submit" size="lg" className="w-full gap-2" disabled={processing}>
                {processing ? (
                  <>
                    <div className="animate-spin w-4 h-4 border-2 border-transparent border-t-current rounded-full"></div>
                    Processing Payment...
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    Complete Purchase ₱{total.toFixed(2)}
                  </>
                )}
              </Button>
            </form>
          </div>

          {/* Order Summary */}
          <div>
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {cartItems && cartItems.map((cartItem) => {
                    return <div key={cartItem.id} className="flex items-start gap-4">
                      <div className="flex-1">
                        <p className="font-medium text-foreground">{cartItem.name}</p>
                        <p className="text-sm text-muted-foreground">Qty: {cartItem.quantity}</p>
                      </div>
                      <p className="font-semibold text-foreground">₱{cartItem.price}</p>
                    </div>
                  })}
                </div>

                <div className="border-t border-border pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-medium">₱{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Tax</span>
                    <span className="font-medium">₱{(total - subtotal).toFixed(2)}</span>
                  </div>

                </div>

                <div className="border-t border-border pt-4 flex justify-between">
                  <span className="font-bold text-foreground">Total</span>
                  <span className="text-2xl font-bold text-primary">₱{total.toFixed(2)}</span>
                </div>

                <Label className="mt-4 mb-2 text-gray-500 font-bold">GCash Ref. No</Label>
                <Input placeholder="Enter the reference number" type="text" required />

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p className="text-xs text-blue-800">
                    Your payment is secure and encrypted. We accept all major payment methods.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
