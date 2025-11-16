"use client"

import { useState } from "react"
import { AlertItem } from "@/components/dashboard/alert-item"
import { alerts } from "@/lib/data-store"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Bell, AlertTriangle, Info, AlertCircle } from "lucide-react"

export default function AlertsPage() {
  const [typeFilter, setTypeFilter] = useState("all")
  const [severityFilter, setSeverityFilter] = useState("all")

  const filteredAlerts = alerts.filter((alert) => {
    const matchesType = typeFilter === "all" || alert.type === typeFilter
    const matchesSeverity = severityFilter === "all" || alert.severity === severityFilter
    return matchesType && matchesSeverity
  })

  const alertsByType = {
    low_stock: alerts.filter((a) => a.type === "low_stock").length,
    payment_due: alerts.filter((a) => a.type === "payment_due").length,
    payment_overdue: alerts.filter((a) => a.type === "payment_overdue").length,
  }

  return (
    <div className="container mx-auto p-4 sm:p-6 space-y-4 sm:space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Alerts</h1>
        <p className="text-sm sm:text-base text-muted-foreground">View and manage system alerts and notifications</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Stock Alerts</CardTitle>
            <AlertTriangle className="h-5 w-5 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{alertsByType.low_stock}</div>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">Items need restocking</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Payment Due Soon</CardTitle>
            <Info className="h-5 w-5 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{alertsByType.payment_due}</div>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">Upcoming payments</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overdue Payments</CardTitle>
            <AlertCircle className="h-5 w-5 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{alertsByType.payment_overdue}</div>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">Require immediate action</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="type">Alert Type</Label>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger id="type">
              <SelectValue placeholder="All types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All types</SelectItem>
              <SelectItem value="low_stock">Low Stock</SelectItem>
              <SelectItem value="payment_due">Payment Due</SelectItem>
              <SelectItem value="payment_overdue">Payment Overdue</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="severity">Severity</Label>
          <Select value={severityFilter} onValueChange={setSeverityFilter}>
            <SelectTrigger id="severity">
              <SelectValue placeholder="All severities" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All severities</SelectItem>
              <SelectItem value="info">Info</SelectItem>
              <SelectItem value="warning">Warning</SelectItem>
              <SelectItem value="error">Error</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Alerts List */}
      <div>
        <h2 className="text-lg font-semibold mb-4">
          {filteredAlerts.length} Alert{filteredAlerts.length !== 1 ? "s" : ""}
        </h2>
        {filteredAlerts.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground border rounded-lg bg-muted/30">
            <Bell className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p>No alerts found</p>
            <p className="text-sm mt-1">All clear! Try adjusting your filters</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredAlerts.map((alert) => (
              // <AlertItem key={alert.id} alert={alert} />
              <div>Hello</div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
