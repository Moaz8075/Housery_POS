"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Lock, Store } from "lucide-react"

export default function LoginPage() {
  const [pin, setPin] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    if (!pin) {
      setError("Please enter a PIN")
      setLoading(false)
      return
    }

    const success = login(pin)
    if (success) {
      router.push("/")
    } else {
      setError("Incorrect PIN. Please try again.")
      setPin("")
      setLoading(false)
    }
  }

  const handlePinInput = (value: string) => {
    // Only allow numbers and limit to 4 digits
    const numericValue = value.replace(/\D/g, "").slice(0, 4)
    setPin(numericValue)
    setError("")
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary/10 via-background to-primary/5 p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="space-y-4 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <Store className="h-8 w-8 text-primary" />
          </div>
          <div>
            <CardTitle className="text-2xl">Housery POS System</CardTitle>
            <CardDescription className="mt-2">Enter your PIN to access the admin panel</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="password"
                  placeholder="Enter 4-digit PIN"
                  value={pin}
                  onChange={(e) => handlePinInput(e.target.value)}
                  className="pl-10 text-center text-2xl tracking-widest"
                  maxLength={4}
                  autoFocus
                  disabled={loading}
                />
              </div>
              {error && <p className="text-sm text-destructive">{error}</p>}
            </div>

            <Button type="submit" className="w-full" size="lg" disabled={loading || pin.length !== 4}>
              {loading ? "Logging in..." : "Login"}
            </Button>

            <p className="text-center text-xs text-muted-foreground">Default PIN: 1234</p>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
