"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useStore } from "@/lib/store"
import Navigation from "@/components/navigation"
import { Mail, ArrowLeft, CheckCircle } from "lucide-react"

export default function VerifyEmailPage() {
  const [code, setCode] = useState("")
  const [timeLeft, setTimeLeft] = useState(60)
  const [canResend, setCanResend] = useState(false)
  const [verified, setVerified] = useState(false)
  const [error, setError] = useState("")
  const { verification, clearVerification, setUser } = useStore()
  const router = useRouter()

  useEffect(() => {
    if (timeLeft <= 0) {
      setCanResend(true)
      return
    }

    const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
    return () => clearTimeout(timer)
  }, [timeLeft])

  if (!verification.email) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation onCartClick={() => {}} />
        <div className="max-w-md mx-auto px-4 py-12">
          <p className="text-center">Redirecting...</p>
        </div>
      </div>
    )
  }

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!code) {
      setError("Please enter the verification code")
      return
    }

    // Simulated verification
    if (code === "123456") {
      setVerified(true)
      setTimeout(() => {
        // Create user after verification
        const user = {
          id: Math.random().toString(36).substr(2, 9),
          email: verification.email,
          name: "User",
        }
        setUser(user)
        clearVerification()
        router.push("/")
      }, 1500)
    } else {
      setError("Invalid verification code. Try 123456 for demo.")
    }
  }

  const handleResend = () => {
    setTimeLeft(60)
    setCanResend(false)
    setError("")
  }

  const handleChangeEmail = () => {
    clearVerification()
    router.push("/register")
  }

  if (verified) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation onCartClick={() => {}} />
        <div className="max-w-md mx-auto px-4 py-12">
          <Card className="border border-border shadow-lg">
            <CardContent className="p-12 text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Email Verified!</h2>
              <p className="text-muted-foreground mb-6">
                Your account is now active. Redirecting you to the home page...
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation onCartClick={() => {}} />

      <div className="max-w-md mx-auto px-4 py-12">
        <Card className="border border-border shadow-lg">
          <CardHeader className="space-y-2 text-center">
            <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center text-primary-foreground font-bold mx-auto">
              C
            </div>
            <CardTitle className="text-2xl">Verify Your Email</CardTitle>
            <p className="text-sm text-muted-foreground">
              We sent a code to <span className="font-medium">{verification.email}</span>
            </p>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleVerify} className="space-y-6">
              {error && (
                <div className="bg-destructive/10 border border-destructive/30 text-destructive px-4 py-2 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Verification Code
                </label>
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="w-full px-4 py-2 border border-border rounded-lg bg-input text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary text-center text-2xl tracking-widest"
                  placeholder="000000"
                  maxLength={6}
                />
                <p className="text-xs text-muted-foreground text-center">Check your email for the 6-digit code</p>
              </div>

              <Button type="submit" className="w-full" size="lg">
                Verify Email
              </Button>

              <div className="text-center">
                {canResend ? (
                  <Button type="button" variant="outline" className="w-full bg-transparent" onClick={handleResend}>
                    Resend Code
                  </Button>
                ) : (
                  <div className="text-sm text-muted-foreground">
                    Resend code in <span className="font-bold text-primary">{timeLeft}s</span>
                  </div>
                )}
              </div>
            </form>

            <div className="mt-6 space-y-3 border-t border-border pt-6">
              <button
                onClick={handleChangeEmail}
                className="w-full flex items-center justify-center gap-2 text-primary hover:text-primary/80 font-medium text-sm"
              >
                <ArrowLeft className="w-4 h-4" />
                Change Email
              </button>

              <Link href="/" className="text-sm text-muted-foreground hover:text-foreground text-center block">
                Back to home
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
