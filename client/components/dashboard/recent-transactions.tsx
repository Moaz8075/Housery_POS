import type { Transaction } from "@/lib/types"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatDistanceToNow } from "date-fns"

interface RecentTransactionsProps {
  transactions: Transaction[]
}

export function RecentTransactions({ transactions }: RecentTransactionsProps) {
  const getTransactionColor = (type: Transaction["type"]) => {
    switch (type) {
      case "sale":
        return "bg-green-100 text-green-800 hover:bg-green-100"
      case "payment_received":
        return "bg-blue-100 text-blue-800 hover:bg-blue-100"
      case "purchase":
        return "bg-orange-100 text-orange-800 hover:bg-orange-100"
      case "payment_made":
        return "bg-red-100 text-red-800 hover:bg-red-100"
      default:
        return ""
    }
  }

  const getTransactionLabel = (type: Transaction["type"]) => {
    switch (type) {
      case "sale":
        return "Sale"
      case "payment_received":
        return "Payment Received"
      case "purchase":
        return "Purchase"
      case "payment_made":
        return "Payment Made"
      default:
        return type
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Transactions</CardTitle>
        <CardDescription>Your latest business activities</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {transactions.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">No recent transactions</p>
          ) : (
            transactions.map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between border-b pb-3 last:border-0">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <Badge className={getTransactionColor(transaction.type)}>
                      {getTransactionLabel(transaction.type)}
                    </Badge>
                    <span className="text-sm font-medium">Rs. {transaction?.amount?.toLocaleString()}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {formatDistanceToNow(transaction.createdAt, { addSuffix: true })}
                  </span>
                </div>
                {transaction.amountPending > 0 && (
                  <Badge variant="outline" className="text-xs">
                    Pending: Rs. {transaction?.amountPending?.toLocaleString()}
                  </Badge>
                )}
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}
