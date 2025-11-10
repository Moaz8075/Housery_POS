"use client"

import { useEffect, useState } from "react"
import { getDashboardStats, getPayments, getSales } from "@/lib/dataProvider"
import { StatCard } from "@/components/dashboard/stat-card"
import { AlertItem } from "@/components/dashboard/alert-item"
import { QuickActions } from "@/components/dashboard/quick-actions"
import { RecentTransactions } from "@/components/dashboard/recent-transactions"
import { TrendingUp, Package, AlertTriangle, ArrowUpRight, ArrowDownRight } from "lucide-react"

export default function DashboardPage() {
  const [stats, setStats] = useState<any>(null)
  const [transactions, setTransactions] = useState<any[]>([])
  const [alerts, setAlerts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true)
        const [statsRes, salesRes, paymentsRes] = await Promise.all([
          getDashboardStats(),
          getSales(),
          getPayments(),
        ])

        setStats(statsRes)
        setTransactions(salesRes.sales?.slice(0, 5) || [])

        // Dynamic alerts based on backend stats
        const alertsList: any[] = []
        if (statsRes.lowStockItemsCount > 0) {
          alertsList.push({
            id: "low-stock",
            type: "warning",
            title: "Low Stock Alert",
            message: `${statsRes.lowStockItemsCount} items need restocking`,
          })
        }
        if (statsRes.overduePaymentsCount > 0) {
          alertsList.push({
            id: "overdue-payments",
            type: "danger",
            title: "Overdue Payments",
            message: `${statsRes.overduePaymentsCount} payments are overdue`,
          })
        }
        setAlerts(alertsList)
      } catch (err) {
        console.error("Failed to load dashboard data", err)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  if (loading || !stats)
    return <div className="p-6 text-center text-gray-500">Loading dashboard data...</div>

  const recentTransactions = transactions.slice(0, 5)
  const criticalAlerts = alerts.slice(0, 3)

  return (
    <div className="container mx-auto p-4 sm:p-6 space-y-4 sm:space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Welcome back! Here's what's happening today.
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Today's Sales"
          value={`Rs. ${stats.totalSalesToday.toLocaleString()}`}
          icon={TrendingUp}
          variant="success"
        />
        <StatCard
          title="Monthly Sales"
          value={`Rs. ${stats.totalSalesThisMonth.toLocaleString()}`}
          subtitle="This month"
          icon={TrendingUp}
          variant="default"
        />
        <StatCard
          title="Low Stock Items"
          value={stats.lowStockItemsCount}
          subtitle={`${stats.lowStockItemsCount} items need restocking`}
          icon={Package}
          variant={stats.lowStockItemsCount > 0 ? "warning" : "default"}
        />
        <StatCard
          title="Overdue Payments"
          value={stats.overduePaymentsCount}
          subtitle={`${stats.upcomingPaymentsCount} upcoming`}
          icon={AlertTriangle}
          variant={stats.overduePaymentsCount > 0 ? "danger" : "default"}
        />
      </div>

      {/* Payment Stats */}
      <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2">
        <StatCard
          title="Pending Receivables"
          value={`Rs. ${stats.pendingReceivables.toLocaleString()}`}
          subtitle="Amount to receive from customers"
          icon={ArrowUpRight}
          variant="success"
        />
        <StatCard
          title="Pending Payables"
          value={`Rs. ${stats.pendingPayables.toLocaleString()}`}
          subtitle="Amount to pay to suppliers"
          icon={ArrowDownRight}
          variant="warning"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-4 sm:gap-6 lg:grid-cols-3">
        {/* Alerts Section */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Important Alerts</h2>
            <a href="/alerts" className="text-sm text-primary hover:underline">
              View all
            </a>
          </div>
          <div className="space-y-3">
            {criticalAlerts.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">No alerts at the moment</div>
            ) : (
              criticalAlerts.map((alert) => <AlertItem key={alert.id} alert={alert} />)
            )}
          </div>

          {/* Recent Transactions */}
          <div className="mt-6">
            <RecentTransactions transactions={recentTransactions} />
          </div>
        </div>

        {/* Quick Actions Sidebar */}
        <div>
          <QuickActions />
        </div>
      </div>
    </div>
  )
}
