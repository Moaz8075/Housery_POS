"use client"

import { useState, useEffect } from "react"
import { createTransaction, updateCustomer, type Customer, getTransactionsByType, type Transaction } from "@/lib/dataProvider"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Phone, Store, CreditCard, Package } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

interface CustomerDetailsDialogProps {
  customer: Customer | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onCustomerUpdate: () => void
}

export function CustomerDetailsDialog({ customer, open, onOpenChange, onCustomerUpdate }: CustomerDetailsDialogProps) {
  const [paymentAmount, setPaymentAmount] = useState('')
  const [showPaymentForm, setShowPaymentForm] = useState(false)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loadingTransactions, setLoadingTransactions] = useState(false)


  // Fetch transactions for this customer
  useEffect(() => {
    if (!open || !customer) return

    const fetchTransactions = async () => {
      setLoadingTransactions(true)
      try {
        const res = await getTransactionsByType(customer._id, "customer")
        setTransactions(res || [])
      } catch (err) {
        console.error("Failed to fetch transactions:", err)
      } finally {
        setLoadingTransactions(false)
      }
    }

    fetchTransactions()
  }, [customer?._id, open])

  const handleReceivePayment = async () => {
    if (!customer) return
    if (Number(paymentAmount) > 0 && Number(paymentAmount) <= customer.pendingPayment) {
      await createTransaction({
        type: "paymentReceive",
        customerId: customer._id,
        amount: Number(paymentAmount),
      })
      await updateCustomer(customer._id, {
        pendingPayment: customer.pendingPayment - Number(paymentAmount),
      })
      onCustomerUpdate?.()
      setPaymentAmount('')
      setShowPaymentForm(false)
      onOpenChange(false)
    }
  }

  if (!customer) return null
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
                        setPaymentAmount('')
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
            {loadingTransactions ? (
              <p className="text-center text-muted-foreground py-8">Loading transactions...</p>
            ) : transactions.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No transactions yet</p>
            ) : (
              <div className="space-y-3">
                {transactions.map((transaction) => (
                  <div key={transaction._id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <Badge
                          className={
                            transaction.type === "sale" || transaction.type === "paymentReceive"
                              ? "bg-green-100 text-green-800 hover:bg-green-100"
                              : "bg-blue-100 text-blue-800 hover:bg-blue-100"
                          }
                        >
                          {transaction.type === "sale"
                            ? "Sale"
                            : transaction.type === "paymentReceive"
                              ? "Payment Received"
                              : transaction.type === "paymentPaid"
                                ? "Payment Paid"
                                : "Purchase"}
                        </Badge>
                        <p className="text-xs text-muted-foreground mt-1">
                          {transaction.createdAt
                            ? new Date(transaction.createdAt).toLocaleDateString()
                            : "-"}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">Rs. {transaction.amount.toLocaleString()}</p>
                        {transaction.amountPending && transaction.amountPending > 0 && (
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
