"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useRouter, usePathname } from "next/navigation"

interface AuthContextType {
  isAuthenticated: boolean
  login: (pin: string) => boolean
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Default PIN is "1234" - can be changed here
const CORRECT_PIN = "1234"

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // Check if user is authenticated from localStorage
    const authStatus = localStorage.getItem("pos_authenticated")
    if (authStatus === "true") {
      setIsAuthenticated(true)
    }
    setIsLoading(false)
  }, [])

  useEffect(() => {
    // Redirect to login if not authenticated and not already on login page
    if (!isLoading && !isAuthenticated && pathname !== "/login") {
      router.push("/login")
    }
  }, [isAuthenticated, isLoading, pathname, router])

  const login = (pin: string): boolean => {
    if (pin === CORRECT_PIN) {
      setIsAuthenticated(true)
      localStorage.setItem("pos_authenticated", "true")
      return true
    }
    return false
  }

  const logout = () => {
    setIsAuthenticated(false)
    localStorage.removeItem("pos_authenticated")
    router.push("/login")
  }

  return <AuthContext.Provider value={{ isAuthenticated, login, logout }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
