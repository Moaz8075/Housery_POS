"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowUpRight, ArrowDownLeft } from 'lucide-react'

interface PaymentMetricsProps {
  stats: {
    pendingReceivables: number
    pendingPayables: number
  }
}

export function PaymentMetrics({ stats }: PaymentMetricsProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-foreground">Payment Status</h2>
      
      <div className="grid gap-4">
        {/* Receivables Card */}
        <Card className="border-l-4 border-l-blue-500 bg-gradient-to-br from-blue-50/50 to-background dark:from-blue-950/20 dark:to-background">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Amount to Receive
              </CardTitle>
              <div className="h-10 w-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <ArrowUpRight className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="text-3xl font-bold text-foreground">
              Rs. {stats.pendingReceivables.toLocaleString()}
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-xs">
                From Customers
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Payables Card */}
        <Card className="border-l-4 border-l-orange-500 bg-gradient-to-br from-orange-50/50 to-background dark:from-orange-950/20 dark:to-background">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Amount to Pay
              </CardTitle>
              <div className="h-10 w-10 rounded-lg bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                <ArrowDownLeft className="h-5 w-5 text-orange-600 dark:text-orange-400" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="text-3xl font-bold text-foreground">
              Rs. {stats.pendingPayables.toLocaleString()}
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-xs">
                To Suppliers
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
