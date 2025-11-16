"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle, Package } from 'lucide-react'
import Link from "next/link"
import { cn } from "@/lib/utils"

interface StockAlertsProps {
  stats: {
    lowStockItemsCount: number
    overduePaymentsCount: number
  }
}

export function StockAlerts({ stats }: StockAlertsProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-foreground">Critical Alerts</h2>

      <div className="grid gap-4">
        {/* Low Stock Alert */}
        <Card className={cn(
          "border-l-4 bg-gradient-to-br to-background",
          stats.lowStockItemsCount > 0
            ? "border-l-yellow-500 from-yellow-50/50 dark:from-yellow-950/20"
            : "border-l-green-500 from-green-50/50 dark:from-green-950/20"
        )}>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Low Stock Items
              </CardTitle>
              <div className={cn(
                "h-10 w-10 rounded-lg flex items-center justify-center",
                stats.lowStockItemsCount > 0
                  ? "bg-yellow-100 dark:bg-yellow-900/30"
                  : "bg-green-100 dark:bg-green-900/30"
              )}>
                <Package className={cn(
                  "h-5 w-5",
                  stats.lowStockItemsCount > 0
                    ? "text-yellow-600 dark:text-yellow-400"
                    : "text-green-600 dark:text-green-400"
                )} />
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="text-3xl font-bold text-foreground">
              {stats.lowStockItemsCount}
            </div>
            <Link href="/stock" className="text-xs text-primary hover:underline">
              View Stock Management →
            </Link>
          </CardContent>
        </Card>

        {/* Overdue Payments Alert */}
        {/* <Card className={cn(
          "border-l-4 bg-gradient-to-br to-background",
          stats.overduePaymentsCount > 0
            ? "border-l-red-500 from-red-50/50 dark:from-red-950/20"
            : "border-l-green-500 from-green-50/50 dark:from-green-950/20"
        )}>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Overdue Payments
              </CardTitle>
              <div className={cn(
                "h-10 w-10 rounded-lg flex items-center justify-center",
                stats.overduePaymentsCount > 0
                  ? "bg-red-100 dark:bg-red-900/30"
                  : "bg-green-100 dark:bg-green-900/30"
              )}>
                <AlertTriangle className={cn(
                  "h-5 w-5",
                  stats.overduePaymentsCount > 0
                    ? "text-red-600 dark:text-red-400"
                    : "text-green-600 dark:text-green-400"
                )} />
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="text-3xl font-bold text-foreground">
              {stats.overduePaymentsCount}
            </div>
            <Link href="/alerts" className="text-xs text-primary hover:underline">
              View All Alerts →
            </Link>
          </CardContent>
        </Card> */}
      </div>
    </div>
  )
}
