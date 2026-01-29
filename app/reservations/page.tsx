"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Calendar, Clock, Users } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useStore } from "@/lib/store"
import { useRouter } from "next/navigation"

export default function ReservationsPage() {
  // very important
    const [isReady, setIsReady] = useState(false);

  const { user } = useStore();
  const router = useRouter();

  const [date, setDate] = useState("")
  const [time, setTime] = useState("")
  const [guests, setGuests] = useState("2")
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    if (!user) {
      router.push(`/login?redirect=/reservations`);
      return;
    }

    setIsReady(true);
  }, [user, router]);

  if (!isReady) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 3000)
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">Reserve Your Table</h1>
          <p className="text-lg text-muted-foreground">
            Experience fine dining at its best. Book your perfect moment with us.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="text-center">
            <CardContent className="p-6">
              <Calendar className="w-8 h-8 text-primary mx-auto mb-3" />
              <h3 className="font-semibold text-foreground mb-1">Easy Booking</h3>
              <p className="text-sm text-muted-foreground">Simple reservation process in seconds</p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-6">
              <Clock className="w-8 h-8 text-primary mx-auto mb-3" />
              <h3 className="font-semibold text-foreground mb-1">Instant Confirmation</h3>
              <p className="text-sm text-muted-foreground">Get immediate booking confirmation</p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-6">
              <Users className="w-8 h-8 text-primary mx-auto mb-3" />
              <h3 className="font-semibold text-foreground mb-1">Any Group Size</h3>
              <p className="text-sm text-muted-foreground">Tables for 1 to 20+ guests</p>
            </CardContent>
          </Card>
        </div>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Reservation Details</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Availability Info */}
            <Card className="bg-primary/5 border-primary/20 mb-6" >
              <CardContent>
                <h3 className="font-semibold text-foreground mb-3">Availability</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Open Monday - Sunday: 10:00 AM - 8:00 PM</li>
                  <li>• Holidays: Call for details</li>
                </ul>
              </CardContent>
            </Card>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Date and Time Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Date</label>
                  <Input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Time</label>
                  <Input
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full"
                    required
                  />
                </div>
              </div>

              {/* Guests */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Number of Guests</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5, 6].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setGuests(num.toString())}
                      className={`flex-1 py-2 rounded-lg font-medium transition ${guests === num.toString()
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-foreground hover:bg-muted/80"
                        }`}
                    >
                      {num === 6 ? "6+" : num}
                    </button>
                  ))}
                </div>
                {guests === "6" && (
                  <Input
                    type="number"
                    min="7"
                    placeholder="Enter number of guests"
                    className="mt-3"
                    onChange={(e) => setGuests(e.target.value)}
                  />
                )}
              </div>

              {/* Submission Status */}
              {submitted && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-green-800">
                  <p className="font-semibold">Reservation Confirmed!</p>
                  <p className="text-sm mt-1">Check your email for confirmation details.</p>
                </div>
              )}

              {/* Submit Button */}
              <Button type="submit" className="w-full py-6 text-lg" size="lg">
                Complete Reservation
              </Button>

              <p className="text-center text-xs text-muted-foreground">
                We'll send you a confirmation email immediately after booking.
              </p>
            </form>
          </CardContent>
        </Card>


      </div>
    </div>
  )
}
