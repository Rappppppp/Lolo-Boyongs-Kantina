"use client"

import type React from "react"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useStore } from "@/lib/store"
import Navigation from "@/components/navigation"
import { Mail, Lock } from "lucide-react"
import { appConfig } from "@/config/app.config"
import Image from "next/image"
import { loginSchema } from "@/lib/schemas"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const { setUser } = useStore()

  const router = useRouter()
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})

    const result = loginSchema.safeParse({ email, password });

    if (!result.success) {
      // Map Zod errors to state
      const fieldErrors: { email?: string; password?: string } = {};
      result.error.errors.forEach((err) => {
        if (err.path[0] === "email") fieldErrors.email = err.message;
        if (err.path[0] === "password") fieldErrors.password = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    // Simulated login
    const user = {
      id: "1",
      email,
      firstName: email.split("@")[0],
      lastName: email.split("@")[0],
    }

    setUser(user)
    router.push(redirect || "/");
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation onCartClick={() => { }} />

      <div className="max-w-md mx-auto px-4 py-12">
        <Card className="border border-border shadow-lg">
          <CardHeader className="space-y-2 text-center">
            <div className="flex items-center justify-center text-primary-foreground font-bold mx-auto">
              <Image src="/app-logo.jpg" alt="Logo" className="rounded-full" width={100} height={100} />
            </div>
            <CardTitle className="text-xl">Sign in to your account</CardTitle>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full px-4 py-2 border rounded-lg bg-input text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary ${errors.email ? "border-destructive" : "border-border"
                    }`}
                  placeholder="you@example.com"
                />
                {errors.email && <p className="text-destructive text-sm">{errors.email}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground flex items-center gap-2">
                  <Lock className="w-4 h-4" />
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`w-full px-4 py-2 border rounded-lg bg-input text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary ${errors.password ? "border-destructive" : "border-border"
                    }`}
                  placeholder="••••••••"
                />
                {errors.password && <p className="text-destructive text-sm">{errors.password}</p>}
              </div>

              <Button type="submit" className="w-full" size="lg">
                Sign In
              </Button>
            </form>

            <div className="mt-6 text-center space-y-2">
              <p className="text-sm text-muted-foreground">
                Don't have an account?{" "}
                <Link href="/register" className="text-primary hover:underline font-medium">
                  Sign up here
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
