"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatDistanceToNow } from "date-fns"
import { TrendingUp, TrendingDown, DollarSign } from 'lucide-react'
import Link from "next/link"
import { Transaction } from "@/lib/dataProvider"

interface RecentTransactionsProps {
  transactions: Transaction[]
}

export function RecentTransactions({ transactions }: RecentTransactionsProps) {
  const getTransactionIcon = (type: Transaction["type"]) => {
    switch (type) {
      case "sale":
      case "paymentReceive":
        return <TrendingUp className="h-4 w-4" />
      case "purchase":
      case "paymentPaid":
        return <TrendingDown className="h-4 w-4" />
      default:
        return <DollarSign className="h-4 w-4" />
    }
  }

  const getTransactionColor = (type: Transaction["type"]) => {
    switch (type) {
      case "sale":
        return "bg-green-100 text-green-800 hover:bg-green-100 dark:bg-green-900/30 dark:text-green-400"
      case "paymentReceive":
        return "bg-blue-100 text-blue-800 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400"
      case "purchase":
        return "bg-orange-100 text-orange-800 hover:bg-orange-100 dark:bg-orange-900/30 dark:text-orange-400"
      case "paymentPaid":
        return "bg-red-100 text-red-800 hover:bg-red-100 dark:bg-red-900/30 dark:text-red-400"
      default:
        return ""
    }
  }

  const getTransactionLabel = (type: Transaction["type"]) => {
    switch (type) {
      case "sale":
        return "Sale"
      case "paymentReceive":
        return "Payment Received"
      case "purchase":
        return "Purchase"
      case "paymentPaid":
        return "Payment Made"
      default:
        return type
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Recent Transactions</CardTitle>
          <CardDescription>Your latest business activities</CardDescription>
        </div>
        <Link href="/sales" className="text-sm text-primary hover:underline">
          View All
        </Link>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {transactions.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-12">
              No recent transactions
            </p>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {transactions.map((transaction) => (
                <div
                  key={transaction?._id}
                  className="border rounded-lg p-4 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center text-muted-foreground">
                        {getTransactionIcon(transaction.type)}
                      </div>
                      <div>
                        <Badge className={getTransactionColor(transaction.type)} variant="secondary">
                          {getTransactionLabel(transaction.type)}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-semibold text-foreground">
                      Rs. {transaction?.amount?.toLocaleString()}
                    </p>
                    {transaction.createdAt && (
                      <p className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(transaction.createdAt), { addSuffix: true })}
                      </p>
                    )}
                    {transaction.amountPending != null && transaction.amountPending > 0 && (
                      <Badge variant="outline" className="text-xs">
                        Pending: Rs. {transaction.amountPending?.toLocaleString()}
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
