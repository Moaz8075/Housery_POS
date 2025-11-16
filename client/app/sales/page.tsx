'use client'

import { transactions } from '@/lib/data-store'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Plus, ArrowLeft } from 'lucide-react'
import { SalesTable } from '@/components/sales/sales-table'
import { getSales, Sale } from '@/lib/dataProvider'
import { useEffect, useState } from 'react'

export default function SalesHistoryPage() {

  const [salesTransactions, setSalesTransactions] = useState<Sale[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchSales = async () => {
      try {
        const res = await getSales()
        setSalesTransactions(res.sales || [])
      } catch (error) {
        console.error("Failed to fetch sales:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchSales()
  }, [])

    if (loading) return <p className="p-4">Loading Salaes History...</p>

  return (
    <div className="container mx-auto p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Sales History</h1>
          <p className="text-muted-foreground text-sm mt-1">View all sales transactions and search through history</p>
        </div>
        <Button asChild className="w-full sm:w-auto">
          <Link href="/sales/new">
            <Plus className="h-4 w-4 mr-2" />
            New Sale
          </Link>
        </Button>
      </div>

      <SalesTable sales={salesTransactions} />
    </div>
  )
}
