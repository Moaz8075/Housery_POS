"use client"

import { useState } from "react"
import type { Customer } from "@/lib/types"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Phone, Store, CreditCard, Package } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { transactions } from "@/lib/data-store"

interface CustomerDetailsDialogProps {
  customer: Customer | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CustomerDetailsDialog({ customer, open, onOpenChange }: CustomerDetailsDialogProps) {
  const [paymentAmount, setPaymentAmount] = useState("")
  const [showPaymentForm, setShowPaymentForm] = useState(false)

  if (!customer) return null

  const customerTransactions = transactions.filter((t) => t.customerId === customer.id)

  const handleReceivePayment = () => {
    if (Number(paymentAmount) > 0 && Number(paymentAmount) <= customer.pendingPayment) {
      console.log("[v0] Payment received:", {
        customerId: customer.id,
        amount: Number(paymentAmount),
      })
      setPaymentAmount("")
      setShowPaymentForm(false)
      // Reset dialog
      onOpenChange(false)
    }
  }

  const initials = customer.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Customer Details</DialogTitle>
          <DialogDescription>View customer information and transaction history</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Customer Info */}
          <div className="flex items-start gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={customer.picture || "/placeholder.svg"} alt={customer.name} />
              <AvatarFallback className="text-lg">{initials}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h3 className="text-xl font-bold">{customer.name}</h3>
              <div className="mt-2 space-y-1 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  <span>{customer.phoneNumber}</span>
                </div>
                {customer.shopName && (
                  <div className="flex items-center gap-2">
                    <Store className="h-4 w-4" />
                    <span>{customer.shopName}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <Separator />

          {/* Payment Summary */}
          <div className="grid grid-cols-2 gap-4">
            <div className="border rounded-lg p-4">
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <Package className="h-4 w-4" />
                <span className="text-sm">Total Purchases</span>
              </div>
              <p className="text-2xl font-bold">Rs. {customer.totalPurchases.toLocaleString()}</p>
            </div>
            <div className="border rounded-lg p-4">
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <CreditCard className="h-4 w-4" />
                <span className="text-sm">Pending Payment</span>
              </div>
              <p className={`text-2xl font-bold ${customer.pendingPayment > 0 ? "text-orange-600" : "text-green-600"}`}>
                Rs. {customer.pendingPayment.toLocaleString()}
              </p>
            </div>
          </div>

          {/* Payment Action */}
          {customer.pendingPayment > 0 && (
            <div className="border rounded-lg p-4 bg-muted/30">
              {!showPaymentForm ? (
                <Button onClick={() => setShowPaymentForm(true)} className="w-full">
                  <CreditCard className="mr-2 h-4 w-4" />
                  Receive Payment
                </Button>
              ) : (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="payment">Payment Amount (Rs.)</Label>
                    <Input
                      id="payment"
                      type="number"
                      min="0"
                      max={customer.pendingPayment}
                      value={paymentAmount}
                      onChange={(e) => setPaymentAmount(e.target.value)}
                      placeholder="Enter amount"
                    />
                    <p className="text-xs text-muted-foreground">
                      Maximum: Rs. {customer.pendingPayment.toLocaleString()}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={handleReceivePayment}
                      disabled={
                        !paymentAmount || Number(paymentAmount) <= 0 || Number(paymentAmount) > customer.pendingPayment
                      }
                      className="flex-1"
                    >
                      Confirm Payment
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setShowPaymentForm(false)
                        setPaymentAmount("")
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}

          <Separator />

          {/* Transaction History */}
          <div>
            <h4 className="font-semibold mb-3">Transaction History</h4>
            {customerTransactions.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No transactions yet</p>
            ) : (
              <div className="space-y-3">
                {customerTransactions.map((transaction) => (
                  <div key={transaction.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <Badge
                          className={
                            transaction.type === "sale"
                              ? "bg-green-100 text-green-800 hover:bg-green-100"
                              : "bg-blue-100 text-blue-800 hover:bg-blue-100"
                          }
                        >
                          {transaction.type === "sale" ? "Sale" : "Payment Received"}
                        </Badge>
                        <p className="text-xs text-muted-foreground mt-1">
                          {formatDistanceToNow(transaction.createdAt, { addSuffix: true })}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">Rs. {transaction.amount.toLocaleString()}</p>
                        {transaction.amountPending > 0 && (
                          <p className="text-xs text-orange-600">
                            Pending: Rs. {transaction.amountPending.toLocaleString()}
                          </p>
                        )}
                      </div>
                    </div>
                    {transaction.note && <p className="text-sm text-muted-foreground mt-2">{transaction.note}</p>}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
