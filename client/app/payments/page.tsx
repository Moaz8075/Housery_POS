"use client"

import { useState } from "react"
import { PaymentCard } from "@/components/payments/payment-card"
import { PaymentFilters } from "@/components/payments/payment-filters"
import { payments } from "@/lib/data-store"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CreditCard, TrendingUp, TrendingDown, AlertCircle } from "lucide-react"
import { isPast } from "date-fns"

export default function PaymentsPage() {
  const [typeFilter, setTypeFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")

  const filteredPayments = payments.filter((payment) => {
    const matchesType = typeFilter === "all" || payment.type === typeFilter

    let matchesStatus = true
    if (statusFilter !== "all") {
      const isOverdue = payment.dueDate && isPast(payment.dueDate) && payment.status !== "paid"
      if (statusFilter === "overdue") {
        matchesStatus = isOverdue
      } else {
        matchesStatus = payment.status === statusFilter && !isOverdue
      }
    }

    return matchesType && matchesStatus
  })

  const totalReceivables = payments.filter((p) => p.type === "receivable").reduce((sum, p) => sum + p.amountPending, 0)

  const totalPayables = payments.filter((p) => p.type === "payable").reduce((sum, p) => sum + p.amountPending, 0)

  const overdueCount = payments.filter((p) => p.dueDate && isPast(p.dueDate) && p.status !== "paid").length

  return (
    <div className="container mx-auto p-4 sm:p-6 space-y-4 sm:space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Payments</h1>
        <p className="text-sm sm:text-base text-muted-foreground">Track and manage all receivables and payables</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Receivables</CardTitle>
            <TrendingUp className="h-5 w-5 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">Rs. {totalReceivables.toLocaleString()}</div>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">To receive from customers</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Payables</CardTitle>
            <TrendingDown className="h-5 w-5 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">Rs. {totalPayables.toLocaleString()}</div>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">To pay to suppliers</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overdue Payments</CardTitle>
            <AlertCircle className="h-5 w-5 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{overdueCount}</div>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">Require immediate attention</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <PaymentFilters
        typeFilter={typeFilter}
        statusFilter={statusFilter}
        onTypeChange={setTypeFilter}
        onStatusChange={setStatusFilter}
      />

      {/* Payments Grid */}
      <div>
        <h2 className="text-lg font-semibold mb-4">
          {filteredPayments.length} Payment{filteredPayments.length !== 1 ? "s" : ""}
        </h2>
        {filteredPayments.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground border rounded-lg bg-muted/30">
            <CreditCard className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p>No payments found</p>
            <p className="text-sm mt-1">Try adjusting your filters</p>
          </div>
        ) : (
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {filteredPayments.map((payment) => (
              <PaymentCard key={payment.id} payment={payment} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
