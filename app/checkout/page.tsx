"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Lock, CreditCard, PhilippinePeso } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Navigation from "@/components/navigation"

import { useStore } from "@/lib/store"
import { useCheckout } from "@/hooks/client/useCheckout"

import { toast } from "sonner"
// import { set } from "date-fns"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

import { useRouter } from "next/navigation"
import QrPaymentDialog from "@/components/qr-payment-dialog"

type OrderItem = {
  order_id: string
  menu_item_id: string
  menu_item_name: string
  price: number
  quantity: number
  line_total: number
}

type Order = {
  order_id: string
  notes?: string
  items: OrderItem[]
  items_total: number
  status: string
  created_at: string
  created_at_human: string
}

export default function CheckoutPage() {
  const { cartItems, getCartTotal, user } = useStore();
  const { checkout } = useCheckout();
  const router = useRouter();

  // Change to GCash only
  // const [paymentMethod, setPaymentMethod] = useState("card")

  const [processing, setProcessing] = useState(false)
  const [completed, setCompleted] = useState(false)
  const [order, setOrder] = useState<Order | null>(null)

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

  useEffect(() => {
    if (cartItems.length === 0) {
      router.push('/menu')
    }
  }, [])

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
      const res = await checkout(payload) as { order: Order };

      setProcessing(false)
      setCompleted(true);
      setOrder(res.order);
      toast.success("Order placed successfully.")
    } catch (e) {
      toast.error("System Error. Failed to checkout.")
      console.error(e)
    }
  }

  if (completed && order) {
    sessionStorage.setItem(`orderId=${order.order_id}`, JSON.stringify(order));

    return router.push(`/checkout/status?orderId=${order.order_id}`)
  }

  return (
    <div className="min-h-screen bg-background">

      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-foreground mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Payment Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Delivery Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Delivery Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">

                  <Label className="mb-1">Receipient Name <span className="text-red-500">*</span></Label>
                  <Input
                    defaultValue={`${user?.firstName} ${user?.lastName}`}
                    placeholder="Full Name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                  />

                  <Label className="mb-1">Email <span className="text-red-500">*</span></Label>
                  <Input
                    defaultValue={user?.email}
                    placeholder="Email Address" type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />

                  <Label className="mb-1">Phone Number <span className="text-red-500">*</span></Label>
                  <Input
                    defaultValue={user?.phoneNumber}
                    placeholder="Phone Number" type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    required
                  />

                  <Label className="mb-1">Delivery Address <span className="text-red-500">*</span></Label>
                  <Input
                    defaultValue={`${user?.streetAddress}, ${user?.barangay}`}
                    placeholder="Delivery Address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    required
                  />

                  <Label className="mb-1">Notes</Label>
                  <Textarea
                    placeholder="Enter any special requests or comments"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />

                  <Label className="mb-1">GCash Ref. No <span className="text-red-500">*</span></Label>
                  <Input placeholder="Enter the reference number" type="text" required />
                  <QrPaymentDialog />
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
