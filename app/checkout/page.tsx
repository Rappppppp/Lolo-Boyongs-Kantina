"use client"

import type React from "react"

import { useState } from "react"
import { Lock, CreditCard, PhilippinePeso } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Navigation from "@/components/navigation"

export default function CheckoutPage() {
  const [paymentMethod, setPaymentMethod] = useState("card")
  const [processing, setProcessing] = useState(false)
  const [completed, setCompleted] = useState(false)

  // Sample order data - would come from cart state
  const subtotal = 95.99
  const tax = 9.6
  const delivery = 5.0
  const total = subtotal + tax + delivery

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setProcessing(true)

    // Simulate payment processing
    setTimeout(() => {
      setProcessing(false)
      setCompleted(true)
    }, 2000)
  }

  if (completed) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation cartCount={0} onCartClick={() => {}} />
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
            <h1 className="text-3xl font-bold text-green-900 mb-4">Order Confirmed!</h1>
            <p className="text-lg text-green-800 mb-2">Your order has been successfully placed</p>
            <p className="text-green-700 mb-8">Order #ORD-20241225-001</p>
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
      <Navigation cartCount={0} onCartClick={() => {}} />

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
                  <Input placeholder="Full Name" required />
                  <Input placeholder="Email Address" type="email" required />
                  <Input placeholder="Phone Number" type="tel" required />
                  <Input placeholder="Street Address" required />
                  <div className="grid grid-cols-2 gap-4">
                    <Input placeholder="City" required />
                    <Input placeholder="ZIP Code" required />
                  </div>
                </CardContent>
              </Card>

              {/* Payment Method */}
              <Card>
                <CardHeader>
                  <CardTitle>Payment Method</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { value: "card", label: "Credit Card", icon: CreditCard },
                      { value: "gcash", label: "GCash", icon: PhilippinePeso },
                    ].map((method) => (
                      <label
                        key={method.value}
                        className={`flex items-center gap-3 p-4 border rounded-lg cursor-pointer transition ${
                          paymentMethod === method.value ? "border-primary bg-primary/5" : "border-border"
                        }`}
                      >
                        <input
                          type="radio"
                          value={method.value}
                          checked={paymentMethod === method.value}
                          onChange={(e) => setPaymentMethod(e.target.value)}
                          className="cursor-pointer"
                        />
                        <method.icon className="w-5 h-5 text-primary" />
                        <span className="font-medium">{method.label}</span>
                      </label>
                    ))}
                  </div>

                  {paymentMethod === "card" && (
                    <div className="space-y-4 pt-4 border-t border-border">
                      <Input placeholder="Cardholder Name" required />
                      <Input placeholder="Card Number" required />
                      <div className="grid grid-cols-2 gap-4">
                        <Input placeholder="MM/YY" required />
                        <Input placeholder="CVC" required />
                      </div>
                    </div>
                  )}

                  {paymentMethod === "gcash" && (
                    <div className="space-y-4 pt-4 border-t border-border">
                      <Input placeholder="GCash Mobile Number" type="tel" required />
                      <p className="text-sm text-muted-foreground">
                        You will receive a prompt on your GCash app to complete the payment
                      </p>
                    </div>
                  )}
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
                    Complete Purchase ${total.toFixed(2)}
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
                  <div className="flex items-start gap-4">
                    <div className="flex-1">
                      <p className="font-medium text-foreground">Pan-Seared Salmon</p>
                      <p className="text-sm text-muted-foreground">Qty: 2</p>
                    </div>
                    <p className="font-semibold text-foreground">$49.98</p>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="flex-1">
                      <p className="font-medium text-foreground">Truffle Dumplings</p>
                      <p className="text-sm text-muted-foreground">Qty: 1</p>
                    </div>
                    <p className="font-semibold text-foreground">$12.99</p>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="flex-1">
                      <p className="font-medium text-foreground">Chocolate Lava Cake</p>
                      <p className="text-sm text-muted-foreground">Qty: 2</p>
                    </div>
                    <p className="font-semibold text-foreground">$17.98</p>
                  </div>
                </div>

                <div className="border-t border-border pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-medium">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Tax</span>
                    <span className="font-medium">${tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Delivery</span>
                    <span className="font-medium">${delivery.toFixed(2)}</span>
                  </div>
                </div>

                <div className="border-t border-border pt-4 flex justify-between">
                  <span className="font-bold text-foreground">Total</span>
                  <span className="text-2xl font-bold text-primary">${total.toFixed(2)}</span>
                </div>

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
