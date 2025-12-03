"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useStore } from "@/lib/store"
import Navigation from "@/components/navigation"
import { User, Mail, Lock } from "lucide-react"
import { registerSchema } from "@/lib/schemas"
import Image from "next/image"

export default function RegisterPage() {
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [fieldErrors, setFieldErrors] = useState<Record<string, string | string[]>>({})

  const { setVerification } = useStore()
  const router = useRouter()


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setFieldErrors({})

    const result = registerSchema.safeParse({
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
    })

    if (!result.success) {
      const errors: Record<string, string | string[]> = {}

      result.error.errors.forEach((err) => {
        const field = err.path[0] as string

        if (!errors[field]) errors[field] = []

          ; (errors[field] as string[]).push(err.message)
      })

      setFieldErrors(errors)

      return
    }

    setVerification(email)
    router.push("/verify-email")
  }



  return (
    <div className="min-h-screen bg-background">
      <Navigation onCartClick={() => { }} />

      <div className="max-w-2xl mx-auto px-4 py-12">
        <Card className="border border-border shadow-lg">
          <CardHeader className="space-y-2 text-center">
            <div className="flex items-center justify-center text-primary-foreground font-bold mx-auto">
              <Image src="/app-logo.jpg" alt="Logo" className="rounded-full" width={100} height={100} />
            </div>
            <CardTitle className="text-xl">Create your account to start ordering</CardTitle>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                <label className="text-sm font-medium text-foreground flex items-center gap-2">
                  <User className="w-4 h-4" />
                  First Name
                </label>

                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className={`w-full px-4 py-2 border rounded-lg bg-input text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary
      ${fieldErrors.firstName ? "border-destructive" : "border-border"}`}
                  placeholder="Enter your first name"
                />

                {fieldErrors.firstName && (
                  <p className="text-destructive text-sm">{fieldErrors.firstName}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Last Name
                </label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className={`w-full px-4 py-2 border rounded-lg bg-input text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary
    ${fieldErrors.lastName ? "border-destructive" : "border-border"}`}
                  placeholder="Enter your last name"
                />
                {fieldErrors.lastName && (
                  <p className="text-destructive text-sm">{fieldErrors.lastName}</p>
                )}

              </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full px-4 py-2 border rounded-lg bg-input text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary
    ${fieldErrors.email ? "border-destructive" : "border-border"}`}
                  placeholder="Enter your email"
                />
                {fieldErrors.email && (
                  <p className="text-destructive text-sm">{fieldErrors.email}</p>
                )}

              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                <label className="text-sm font-medium text-foreground flex items-center gap-2">
                  <Lock className="w-4 h-4" />
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`w-full px-4 py-2 border rounded-lg bg-input text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary
    ${fieldErrors.password ? "border-destructive" : "border-border"}`}
                  placeholder="Enter a password"
                />
                {fieldErrors.password && (
                  <div className="text-destructive text-sm space-y-1">
                    {Array.isArray(fieldErrors.password)
                      ? fieldErrors.password.map((msg, i) => <p key={i}>{msg}</p>)
                      : <p>{fieldErrors.password}</p>}
                  </div>
                )}


              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground flex items-center gap-2">
                  <Lock className="w-4 h-4" />
                  Confirm Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={`w-full px-4 py-2 border rounded-lg bg-input text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary
    ${fieldErrors.confirmPassword ? "border-destructive" : "border-border"}`}
                  placeholder="Confirm your password"
                />
                {fieldErrors.confirmPassword && (
                  <p className="text-destructive text-sm">{fieldErrors.confirmPassword}</p>
                )}

              </div>
              </div>

              <Button type="submit" className="w-full" size="lg">
                Create Account
              </Button>
            </form>

            <div className="mt-6 text-center space-y-2">
              <p className="text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link href="/login" className="text-primary hover:underline font-medium">
                  Sign in here
                </Link>
              </p>
              <Link href="/" className="text-sm text-primary hover:underline block">
                Back to home
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
