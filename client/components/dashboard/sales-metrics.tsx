"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, Calendar } from 'lucide-react'
import { cn } from "@/lib/utils"

interface SalesMetricsProps {
  stats: {
    totalSalesToday: number
    totalSalesThisMonth: number
  }
}

export function SalesMetrics({ stats }: SalesMetricsProps) {
  const todayChange = stats?.totalSalesThisMonth > 0 
    ? ((stats.totalSalesToday / stats.totalSalesThisMonth) * 100).toFixed(1)
    : 0

  return (
    <div className="space-y-6">
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
        {/* Today's Sales Card */}
        <Card className="border-l-4 border-l-green-500 bg-gradient-to-br from-green-50/50 to-background dark:from-green-950/20 dark:to-background">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Today's Sales
              </CardTitle>
              <div className="h-10 w-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-foreground">
                Rs. {stats.totalSalesToday.toLocaleString()}
              </div>
              <p className="text-xs text-green-600 dark:text-green-400">
                ↑ {todayChange}% of monthly target
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Monthly Sales Card */}
        <Card className="border-l-4 border-l-primary bg-gradient-to-br from-blue-50/50 to-background dark:from-blue-950/20 dark:to-background">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Monthly Sales
              </CardTitle>
              <div className="h-10 w-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <Calendar className="h-5 w-5 text-primary" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-foreground">
                Rs. {stats.totalSalesThisMonth.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                Current month total
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sales Summary Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Sales Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Daily Average</span>
              <span className="font-semibold">
                Rs. {Math.round(stats.totalSalesThisMonth / 30).toLocaleString()}
              </span>
            </div>
            <div className="h-2 bg-secondary rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-green-400 to-green-600"
                style={{ 
                  width: `${Math.min((stats.totalSalesToday / (stats.totalSalesThisMonth / 30)) * 100, 100)}%` 
                }}
              ></div>
            </div>
            <p className="text-xs text-muted-foreground">
              Today vs daily average
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
