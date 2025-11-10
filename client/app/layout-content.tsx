"use client"

import type React from "react"
import { usePathname } from "next/navigation"
import { Sidebar } from "@/components/layout/sidebar"
import { MobileHeader } from "@/components/layout/mobile-header"
import { AuthProvider } from "@/lib/auth-context"

export function LayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isLoginPage = pathname === "/login"

  return (
    <AuthProvider>
      {isLoginPage ? (
        <>{children}</>
      ) : (
        <>
          <MobileHeader />
          <div className="flex h-screen overflow-hidden">
            <Sidebar />
            <main className="flex-1 overflow-y-auto bg-muted/10">{children}</main>
          </div>
        </>
      )}
    </AuthProvider>
  )
}
