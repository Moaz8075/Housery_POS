"use client"

import type { Payment } from "@/lib/types"
import { customers, suppliers } from "@/lib/data-store"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, CreditCard, ArrowUpRight, ArrowDownRight } from "lucide-react"
import { format, formatDistanceToNow, isPast } from "date-fns"
import { cn } from "@/lib/utils"

interface PaymentCardProps {
  payment: Payment
  onAction?: () => void
}

export function PaymentCard({ payment, onAction }: PaymentCardProps) {
  const isOverdue = payment.dueDate && isPast(payment.dueDate) && payment.status !== "paid"
  const isReceivable = payment.type === "receivable"

  const entity = isReceivable
    ? customers.find((c) => c.id === payment.customerId)
    : suppliers.find((s) => s.id === payment.supplierId)

  const statusColors = {
    pending: "bg-yellow-100 text-yellow-800 border-yellow-300",
    partial: "bg-orange-100 text-orange-800 border-orange-300",
    paid: "bg-green-100 text-green-800 border-green-300",
    overdue: "bg-red-100 text-red-800 border-red-300",
  }

  const displayStatus = isOverdue ? "overdue" : payment.status

  return (
    <Card className={cn(isOverdue && "border-red-300 bg-red-50/30")}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            {isReceivable ? (
              <ArrowUpRight className="h-5 w-5 text-green-600" />
            ) : (
              <ArrowDownRight className="h-5 w-5 text-red-600" />
            )}
            <div>
              <p className="font-semibold">{isReceivable ? "Receivable" : "Payable"}</p>
              <p className="text-sm text-muted-foreground">{entity?.name || "Unknown"}</p>
            </div>
          </div>
          <Badge variant="outline" className={statusColors[displayStatus]}>
            {displayStatus.charAt(0).toUpperCase() + displayStatus.slice(1)}
          </Badge>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Total Amount:</span>
            <span className="font-semibold">Rs. {payment.amount.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Paid:</span>
            <span className="font-semibold text-green-600">Rs. {payment.amountPaid.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Pending:</span>
            <span className={cn("font-semibold", payment.amountPending > 0 ? "text-red-600" : "text-green-600")}>
              Rs. {payment.amountPending.toLocaleString()}
            </span>
          </div>
        </div>

        {payment.dueDate && (
          <div className="mt-3 pt-3 border-t flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>Due: {format(payment.dueDate, "MMM dd, yyyy")}</span>
            </div>
            {isOverdue && (
              <span className="text-xs text-red-600 font-medium">{formatDistanceToNow(payment.dueDate)} overdue</span>
            )}
          </div>
        )}

        {payment.status !== "paid" && onAction && (
          <Button onClick={onAction} className="w-full mt-3" variant={isReceivable ? "default" : "outline"} size="sm">
            <CreditCard className="mr-2 h-4 w-4" />
            {isReceivable ? "Receive Payment" : "Make Payment"}
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
