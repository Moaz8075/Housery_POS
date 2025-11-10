"use client"

import { MobileNav } from "./mobile-nav"

export function MobileHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background md:hidden">
      <div className="flex h-16 items-center px-4">
        <MobileNav />
        <h1 className="ml-4 text-lg font-bold">Housery POS</h1>
      </div>
    </header>
  )
}
