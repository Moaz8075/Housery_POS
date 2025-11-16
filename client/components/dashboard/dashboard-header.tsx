"use client"

import { Button } from "@/components/ui/button"
import { BarChart3, RefreshCw } from 'lucide-react'
import { format } from "date-fns"

export function DashboardHeader() {
  const handleRefresh = () => {
    window.location.reload()
  }

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 py-2">
      <div>
        <div className="flex items-center gap-3 mb-2">
          <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <BarChart3 className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Dashboard</h1>
            <p className="text-xs sm:text-sm text-muted-foreground">
              {format(new Date(), "EEEE, MMMM d, yyyy")}
            </p>
          </div>
        </div>
      </div>
      <Button
        variant="outline"
        size="sm"
        onClick={handleRefresh}
        className="self-start sm:self-auto"
      >
        <RefreshCw className="h-4 w-4 mr-2" />
        Refresh
      </Button>
    </div>
  )
}
