"use client"

import type { Supplier } from "@/lib/types"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Phone, Store } from "lucide-react"

interface SupplierCardProps {
  supplier: Supplier
  onClick: () => void
}

export function SupplierCard({ supplier, onClick }: SupplierCardProps) {
  const initials = supplier.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()

  return (
    <Card className="cursor-pointer transition-all hover:border-primary hover:shadow-md" onClick={onClick}>
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          <Avatar className="h-12 w-12">
            <AvatarImage src={supplier.picture || "/placeholder.svg"} alt={supplier.name} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-1">
              <h3 className="font-semibold truncate">{supplier.name}</h3>
              {supplier.pendingPayment > 0 && (
                <Badge variant="outline" className="bg-red-100 text-red-800 border-red-300 shrink-0">
                  Due
                </Badge>
              )}
            </div>
            <div className="space-y-1 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Phone className="h-3 w-3" />
                <span className="truncate">{supplier.phoneNumber}</span>
              </div>
              {supplier.shopName && (
                <div className="flex items-center gap-2">
                  <Store className="h-3 w-3" />
                  <span className="truncate">{supplier.shopName}</span>
                </div>
              )}
            </div>
            <div className="mt-3 pt-3 border-t flex justify-between text-xs">
              <div>
                <p className="text-muted-foreground">Total Purchases</p>
                <p className="font-semibold">Rs. {supplier.totalPurchases.toLocaleString()}</p>
              </div>
              <div className="text-right">
                <p className="text-muted-foreground">Payable</p>
                <p className={`font-semibold ${supplier.pendingPayment > 0 ? "text-red-600" : "text-green-600"}`}>
                  Rs. {supplier.pendingPayment.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
