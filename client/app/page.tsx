"use client"

import { useEffect, useState } from "react"
import { getDashboardStats, getTransactions } from "@/lib/dataProvider"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { SalesMetrics } from "@/components/dashboard/sales-metrics"
import { PaymentMetrics } from "@/components/dashboard/payment-metrics"
import { StockAlerts } from "@/components/dashboard/stock-alerts"
import { RecentTransactions } from "@/components/dashboard/recent-transactions"
import { QuickActions } from "@/components/dashboard/quick-actions"

const defaultStats = {
  totalSalesToday: 0,
  totalSalesThisMonth: 0,
  lowStockItemsCount: 0,
  overduePaymentsCount: 0,
  upcomingPaymentsCount: 0,
  pendingReceivables: 0,
  pendingPayables: 0,
}

export default function DashboardPage() {
  const [stats, setStats] = useState(defaultStats)
  const [transactions, setTransactions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true)
        const [statsRes, salesRes] = await Promise.all([
          getDashboardStats(),
          getTransactions(),
        ])

        setStats(statsRes || defaultStats)
        setTransactions(salesRes?.slice(0, 5) || [])
      } catch (err) {
        console.error("Failed to load dashboard data", err)
        setStats(defaultStats)
        setTransactions([])
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto p-4 sm:p-6 space-y-6 sm:space-y-8">

        <DashboardHeader />

        {/* Loading State */}
        {loading ? (
          <div className="text-center py-20 text-muted-foreground">
            Loading dashboard...
          </div>
        ) : (
          <>
            {/* Main Metrics Grid */}
            <div className="grid gap-6 lg:grid-cols-3">
              <div className="lg:col-span-2 space-y-6">
                <SalesMetrics stats={stats} />
              </div>
              <div className="space-y-6">
                <QuickActions />
              </div>
            </div>

            {/* Payment + Low Stock Section */}
            <div className="grid gap-6 lg:grid-cols-2">
              <PaymentMetrics stats={stats} />
              <StockAlerts stats={stats} />
            </div>

            {/* Recent Transactions */}
            <RecentTransactions transactions={transactions} />
          </>
        )}
      </div>
    </main>
  )
}
