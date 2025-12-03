"use client"

import type React from "react"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Navigation from "@/components/navigation"
import { Mail, Lock, EyeOff, Eye, Loader2 } from "lucide-react"
import Image from "next/image"
import { loginSchema } from "@/lib/schemas"
import { useLogin } from "@/hooks/auth/useLogin"

export default function LoginPage() {
  const { loading, login } = useLogin();

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const router = useRouter()
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setErrors({}); // reset errors

    // --- ZOD VALIDATION ---
    const result = loginSchema.safeParse({ email, password });

    if (!result.success) {
      const zodErrors: any = {};
      result.error.errors.forEach((err) => {
        const field = err.path[0];
        zodErrors[field] = err.message;
      });
      setErrors(zodErrors);
      return;
    }

    // --- API REQUEST ---
    try {
      await login(email, password);
      router.push(redirect || "/");
    } catch (err: any) {

      // --- Laravel validation errors ---
      if (err?.errors) {
        const formatted: Record<string, string> = {};
        for (const key in err.errors) {
          formatted[key] = err.errors[key][0];
        }
        setErrors(formatted);
        return;
      }

      // --- "Invalid credentials" case ---
      if (err?.error === "Invalid credentials") {
        setErrors({
          email: "Invalid email or password",
          password: "Invalid email or password",
        });
        return;
      }

      // --- Fallback unexpected error ---
      setErrors({
        email: err?.message || "Login failed",
        password: "",
      });
    }
  };

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
                  className={`w-full px-4 py-2 border rounded-lg bg-input text-foreground placeholder-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary ${errors.email ? "border-destructive" : "border-border"
                    }`}
                  placeholder="example.lolo@boyongs.com"
                />
                {errors.email && <p className="text-destructive text-sm">{errors.email}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground flex items-center gap-2">
                  <Lock className="w-4 h-4" />
                  Password
                </label>

                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`w-full px-4 py-2 border rounded-lg bg-input text-foreground placeholder-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary ${errors.password ? "border-destructive" : "border-border"
                      }`}
                    placeholder="••••••••"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 inset-y-0 flex items-center text-muted-foreground hover:text-foreground transition cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>

                {errors.password && <p className="text-destructive text-sm">{errors.password}</p>}
              </div>

              <Button type="submit" className="w-full" size="lg">
                {
                  loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Sign In"
                }
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
