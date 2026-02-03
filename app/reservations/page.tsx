"use client";

import React from "react"

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Calendar, Clock, Users, CheckCircle, AlertCircle, ChevronRight, Sparkles } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useReservationStore, useStore } from "@/lib/store";
import { reservationSchema } from "@/lib/schemas";
import z from "zod";

import { Reservation } from "../types/reservations";
import { useReservation } from "@/hooks/client/useReservation";

type ReservationForm = z.infer<typeof reservationSchema>;
type ReservationErrors = z.ZodFormattedError<ReservationForm>;

export default function ReservationsPage() {
  const { user } = useStore();
  const router = useRouter();
  const [isReady, setIsReady] = useState(false);

  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [guestPreset, setGuestPreset] = useState<null | number>(2);
  const [guestCustom, setGuestCustom] = useState("");
  const [errors, setErrors] = useState<ReservationErrors | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const { createReservation, fetchReservations, loading } = useReservation();
  const { reservations, setReservations, addReservation } = useReservationStore();

  const guests =
    guestPreset === 6 ? guestCustom : guestPreset?.toString() ?? "";

  useEffect(() => {
    if (!user) {
      router.push(`/login?redirect=/reservations`);
      return;
    }
    setIsReady(true);
  }, [user, router]);

  useEffect(() => {
    if (!isReady) return;
  }, []);

  useEffect(() => {

    fetchReservations()
      .then((res) => {
        setReservations(res)
      });
  }, [])


  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      const result = reservationSchema.safeParse({
        date,
        time,
        guests,
      });

      if (!result.success) {
        setErrors(result.error.format());
        return;
      }

      setErrors(null);

      try {
        const newRes = await createReservation({
          date,
          time,
          guests: Number(guests),
        });

        // unwrap .data from the hook API
        addReservation(newRes); // newRes is already Reservation type (not { data: ... })

        setSubmitted(true);

        setDate("");
        setTime("");
        setGuestPreset(2);
        setGuestCustom("");

        setTimeout(() => setSubmitted(false), 3000);
      } catch (err) {
        // handled inside the hook
      }
    },
    [date, time, guests, createReservation, addReservation]
  );

  if (!isReady) return null;

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "confirmed":
        return "bg-emerald-50 border-emerald-200 text-emerald-900";
      case "pending":
        return "bg-amber-50 border-amber-200 text-amber-900";
      case "cancelled":
        return "bg-red-50 border-red-200 text-red-900";
      default:
        return "bg-blue-50 border-blue-200 text-blue-900";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status?.toLowerCase()) {
      case "confirmed":
        return <CheckCircle className="w-5 h-5 text-emerald-600" />;
      case "cancelled":
        return <AlertCircle className="w-5 h-5 text-red-600" />;
      default:
        return <Clock className="w-5 h-5 text-amber-600" />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        {/* Header Section */}
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-6 h-6 text-accent" />
            <span className="text-sm font-semibold text-accent uppercase tracking-wide">Book Your Experience</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-3 text-balance">
            Reserve Your Table
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl text-pretty">
            Experience fine dining at its best. Select your perfect date, time, and party size to secure your reservation.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Booking Form */}
          <div className="lg:col-span-2 order-1 lg:order-1">
            {/* Highlights */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
              <div className="flex gap-4 items-start">
                <div className="rounded-lg bg-accent/10 p-3 flex-shrink-0">
                  <Calendar className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground text-sm">Easy Booking</h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    Quick 30-second reservation
                  </p>
                </div>
              </div>
              <div className="flex gap-4 items-start">
                <div className="rounded-lg bg-accent/10 p-3 flex-shrink-0">
                  <Clock className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground text-sm">Instant Confirmation</h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    Immediate booking confirmation
                  </p>
                </div>
              </div>
              <div className="flex gap-4 items-start">
                <div className="rounded-lg bg-accent/10 p-3 flex-shrink-0">
                  <Users className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground text-sm">Any Group Size</h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    Perfect tables for all party sizes
                  </p>
                </div>
              </div>
            </div>

            {/* Reservation Form */}
            <Card className="border shadow-sm sticky top-24">
              <CardHeader className="bg-primary text-primary-foreground p-6">
                <CardTitle className="text-2xl">Create New Reservation</CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                {/* Info Box */}
                <div className="bg-muted rounded-lg p-5 mb-8 border border-border">
                  <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                    <Clock className="w-4 h-4" /> Hours of Operation
                  </h3>
                  <ul className="space-y-1 text-sm text-foreground/75">
                    <li>Monday - Sunday: 10:00 AM - 8:00 PM</li>
                    <li>Holidays: Call for details</li>
                  </ul>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Date & Time */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-foreground mb-2.5">
                        Reservation Date
                      </label>
                      <Input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="w-full"
                        required
                      />
                      {errors?.date?._errors[0] && (
                        <p className="text-sm text-destructive mt-2 flex items-center gap-1">
                          <AlertCircle className="w-4 h-4" /> {errors.date._errors[0]}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-foreground mb-2.5">
                        Reservation Time
                      </label>
                      <Input
                        type="time"
                        value={time}
                        onChange={(e) => setTime(e.target.value)}
                        className="w-full"
                        required
                      />
                      {errors?.time?._errors[0] && (
                        <p className="text-sm text-destructive mt-2 flex items-center gap-1">
                          <AlertCircle className="w-4 h-4" /> {errors.time._errors[0]}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Guests */}
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-3">
                      Number of Guests
                    </label>
                    <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                      {[1, 2, 3, 4, 5, 6].map((num) => (
                        <button
                          key={num}
                          type="button"
                          onClick={() => {
                            setGuestPreset(num);
                            if (num !== 6) setGuestCustom("");
                          }}
                          className={`py-3 rounded-lg font-semibold transition-all duration-200 border ${guestPreset === num
                            ? "bg-primary text-primary-foreground border-primary shadow-md scale-105"
                            : "bg-card text-foreground border-border hover:border-primary/50 hover:bg-muted"
                            }`}
                        >
                          {num === 6 ? "6+" : num}
                        </button>
                      ))}
                    </div>
                    {guestPreset === 6 && (
                      <Input
                        type="number"
                        min="7"
                        placeholder="Enter number of guests"
                        className="mt-3"
                        value={guestCustom}
                        onChange={(e) => setGuestCustom(e.target.value)}
                      />
                    )}
                    {errors?.guests?._errors[0] && (
                      <p className="text-sm text-destructive mt-2 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" /> {errors.guests._errors[0]}
                      </p>
                    )}
                  </div>

                  {/* Submission Status */}
                  {submitted && (
                    <div className="bg-emerald-50 border-2 border-emerald-200 rounded-lg p-5 text-emerald-900 flex items-start gap-3">
                      <CheckCircle className="w-6 h-6 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold">Reservation Confirmed!</p>
                        <p className="text-sm mt-1">
                          Check your email for confirmation details.
                        </p>
                      </div>
                    </div>
                  )}

                  <Button
                    type="submit"
                    className="w-full py-6 text-lg bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-lg transition-all duration-200"
                    size="lg"
                    disabled={loading}
                  >
                    {loading ? "Submitting..." : "Complete Reservation"}
                  </Button>

                  <p className="text-center text-sm text-muted-foreground">
                    We'll send you a confirmation email immediately after booking.
                  </p>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Reservations List */}
          <div className="lg:col-span-1 order-2 lg:order-2">
            <div className="sticky top-4">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-foreground mb-1 flex items-center gap-2">
                  <Calendar className="w-6 h-6" /> Your Reservations
                </h2>
                <p className="text-sm text-muted-foreground">
                  {reservations.length} booking{reservations.length !== 1 ? "s" : ""}
                </p>
              </div>

              {reservations.length === 0 ? (
                <Card className="border shadow-sm">
                  <CardContent className="p-8 text-center">
                    <div className="rounded-full bg-muted w-16 h-16 flex items-center justify-center mx-auto mb-4">
                      <Calendar className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <p className="text-foreground font-medium">No reservations yet</p>
                    <p className="text-sm text-muted-foreground mt-2">
                      Create your first reservation to get started
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {reservations.map((r: Reservation) => (
                    <Card
                      key={r.id}
                      className="border shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden group"
                    >
                      <CardContent>
                        <div className="flex items-start justify-between gap-3 mb-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <Calendar className="w-4 h-4 text-accent" />
                              <p className="font-semibold text-foreground">{r.date}</p>
                            </div>
                            <div className="flex items-center gap-2 text-foreground/75">
                              <Clock className="w-4 h-4 text-accent" />
                              <p className="text-sm">{r.time}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="flex items-center justify-end gap-1 mb-2">
                              {getStatusIcon(r.status)}
                              <span
                                className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                                  r.status
                                )}`}
                              >
                                {r.status || "Pending"}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-accent" />
                          <span className="text-sm font-medium text-foreground">
                            {r.guests} {r.guests === 1 ? "guest" : "guests"}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
