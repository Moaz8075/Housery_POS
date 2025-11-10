"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { LayoutDashboard, ShoppingCart, Package, Users, Truck, CreditCard, Bell, LogOut, Menu } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "New Sale", href: "/sales/new", icon: ShoppingCart },
  { name: "Stock", href: "/stock", icon: Package },
  { name: "Customers", href: "/customers", icon: Users },
  { name: "Suppliers", href: "/suppliers", icon: Truck },
  { name: "Payments", href: "/payments", icon: CreditCard },
  { name: "Alerts", href: "/alerts", icon: Bell },
]

export function MobileNav() {
  const pathname = usePathname()
  const { logout } = useAuth()
  const [open, setOpen] = useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-64 p-0">
        <div className="flex h-full flex-col">
          <SheetHeader className="h-16 flex-row items-center border-b px-6">
            <SheetTitle>Housery POS</SheetTitle>
          </SheetHeader>
          <nav className="flex-1 space-y-1 p-4">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground",
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  {item.name}
                </Link>
              )
            })}
          </nav>
          <div className="border-t p-4">
            <Button
              variant="outline"
              className="w-full justify-start gap-3 text-muted-foreground hover:text-destructive bg-transparent"
              onClick={() => {
                logout()
                setOpen(false)
              }}
            >
              <LogOut className="h-5 w-5" />
              Logout
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
