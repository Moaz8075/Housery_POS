"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Phone, Store } from "lucide-react"
import { Customer } from "@/lib/dataProvider"

interface CustomerCardProps {
  customer: Customer
  onClick: () => void
}

export function CustomerCard({ customer, onClick }: CustomerCardProps) {
  const initials = customer.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()

  return (
    <Card className="cursor-pointer transition-all hover:border-primary hover:shadow-md" onClick={onClick}>
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          <Avatar className="h-12 w-12">
            <AvatarImage src={customer.picture || "/placeholder.svg"} alt={customer.name} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-1">
              <h3 className="font-semibold truncate">{customer.name}</h3>
              {customer.pendingPayment > 0 && (
                <Badge variant="outline" className="bg-orange-100 text-orange-800 border-orange-300 shrink-0">
                  Pending
                </Badge>
              )}
            </div>
            <div className="space-y-1 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Phone className="h-3 w-3" />
                <span className="truncate">{customer.phoneNumber}</span>
              </div>
              {customer.shopName && (
                <div className="flex items-center gap-2">
                  <Store className="h-3 w-3" />
                  <span className="truncate">{customer.shopName}</span>
                </div>
              )}
            </div>
            <div className="mt-3 pt-3 border-t flex justify-between text-xs">
              <div>
                <p className="text-muted-foreground">Total Purchases</p>
                <p className="font-semibold">Rs. {customer.totalPurchases.toLocaleString()}</p>
              </div>
              <div className="text-right">
                <p className="text-muted-foreground">Pending</p>
                <p className={`font-semibold ${customer.pendingPayment > 0 ? "text-orange-600" : "text-green-600"}`}>
                  Rs. {customer.pendingPayment.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
