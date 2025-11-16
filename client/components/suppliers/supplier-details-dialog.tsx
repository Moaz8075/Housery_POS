"use client"

import { useEffect, useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Phone, Store, CreditCard, Package, Plus } from "lucide-react"
import { createTransaction, getTransactionsByType, Supplier, Transaction, updateSupplier } from "@/lib/dataProvider"

interface SupplierDetailsDialogProps {
  supplier: Supplier | null;
  open: boolean
  onOpenChange: (open: boolean) => void
  onSupplierUpdate: () => void
}

export function SupplierDetailsDialog({ supplier, open, onOpenChange, onSupplierUpdate }: SupplierDetailsDialogProps) {
  const [paymentAmount, setPaymentAmount] = useState("")
  const [purchaseAmount, setPurchaseAmount] = useState("")
  const [purchaseNote, setPurchaseNote] = useState("")
  const [activeTab, setActiveTab] = useState("overview")
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loadingTransactions, setLoadingTransactions] = useState(false)

  const fetchTransactions = async () => {
    if(!supplier) return
    setLoadingTransactions(true)
    try {
      const res = await getTransactionsByType(supplier._id, "supplier")
      setTransactions(res || [])
    } catch (err) {
      console.error("Failed to fetch transactions:", err)
    } finally {
      setLoadingTransactions(false)
    }
  }
  useEffect(() => {
    if (!open) return

    fetchTransactions()
  }, [supplier?._id, open])



  const handleMakePayment = async () => {
    if (!supplier) return
    if (Number(paymentAmount) > 0 && Number(paymentAmount) <= supplier.totalPurchases - supplier.paidPayment) {
      await updateSupplier(supplier._id, {
        paidPayment: supplier.paidPayment + Number(paymentAmount),
      })
      await createTransaction({
        type: "paymentPaid",
        supplierId: supplier._id,
        amount: Number(paymentAmount),
      })
      onSupplierUpdate?.()
      setPaymentAmount("")
      setActiveTab("overview")
      fetchTransactions()
      onOpenChange(false)
    }
  }

  const handleRecordPurchase = async () => {
    if (!supplier) return
    if (Number(purchaseAmount) > 0) {
       await updateSupplier(supplier._id, {
        totalPurchases: supplier.totalPurchases + Number(purchaseAmount),
      })
      await createTransaction({
        type: "purchase",
        supplierId: supplier._id,
        amount: Number(purchaseAmount),
        note: purchaseNote
      })
      onSupplierUpdate?.()
      setPurchaseAmount("")
      setPurchaseNote("")
      setActiveTab("overview")
      fetchTransactions()
      onOpenChange(false)
    }
  }

  if (!supplier) return null
  const initials = supplier.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Supplier Details</DialogTitle>
          <DialogDescription>Manage supplier information and transactions</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Supplier Info */}
          <div className="flex items-start gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={supplier.picture || "/placeholder.svg"} alt={supplier.name} />
              <AvatarFallback className="text-lg">{initials}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h3 className="text-xl font-bold">{supplier.name}</h3>
              <div className="mt-2 space-y-1 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  <span>{supplier.phoneNumber}</span>
                </div>
                {supplier.shopName && (
                  <div className="flex items-center gap-2">
                    <Store className="h-4 w-4" />
                    <span>{supplier.shopName}</span>
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
              <p className="text-2xl font-bold">Rs. {supplier.totalPurchases.toLocaleString()}</p>
            </div>
            <div className="border rounded-lg p-4">
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <CreditCard className="h-4 w-4" />
                <span className="text-sm">Pending Payment</span>
              </div>
              <p className={`text-2xl font-bold ${supplier.totalPurchases - supplier.paidPayment > 0 ? "text-red-600" : "text-green-600"}`}>
                Rs. {(supplier.totalPurchases - supplier.paidPayment).toLocaleString()}
              </p>
            </div>
          </div>

          <Separator />

          {/* Tabs for Actions */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="payment">Make Payment</TabsTrigger>
              <TabsTrigger value="purchase">Record Purchase</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <div className="text-center py-8">
                <p className="text-muted-foreground">Use the tabs above to make payments or record new purchases</p>
                <div className="flex gap-2 justify-center mt-4">
                  {supplier.totalPurchases - supplier.paidPayment > 0 && (
                    <Button onClick={() => setActiveTab("payment")}>
                      <CreditCard className="mr-2 h-4 w-4" />
                      Make Payment
                    </Button>
                  )}
                  <Button variant="outline" onClick={() => setActiveTab("purchase")}>
                    <Plus className="mr-2 h-4 w-4" />
                    Record Purchase
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="payment" className="space-y-4">
              <div className="border rounded-lg p-4 bg-muted/30">
                <h4 className="font-semibold mb-4">Make Payment to Supplier</h4>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="payment">Payment Amount (Rs.)</Label>
                    <Input
                      id="payment"
                      type="number"
                      min="0"
                      max={supplier.totalPurchases - supplier.paidPayment}
                      value={paymentAmount}
                      onChange={(e) => setPaymentAmount(e.target.value)}
                      placeholder="Enter amount"
                    />
                    <p className="text-xs text-muted-foreground">
                      Pending: Rs. {(supplier.totalPurchases - supplier.paidPayment).toLocaleString()}
                    </p>
                  </div>
                  <Button
                    onClick={handleMakePayment}
                    disabled={
                      !paymentAmount || Number(paymentAmount) <= 0 || Number(paymentAmount) > (supplier.totalPurchases - supplier.paidPayment)
                    }
                    className="w-full"
                  >
                    Confirm Payment
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="purchase" className="space-y-4">
              <div className="border rounded-lg p-4 bg-muted/30">
                <h4 className="font-semibold mb-4">Record New Purchase</h4>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="purchase">Purchase Amount (Rs.)</Label>
                    <Input
                      id="purchase"
                      type="number"
                      min="0"
                      value={purchaseAmount}
                      onChange={(e) => setPurchaseAmount(e.target.value)}
                      placeholder="Enter amount"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="note">Note (Optional)</Label>
                    <Textarea
                      id="note"
                      placeholder="What did you purchase?"
                      value={purchaseNote}
                      onChange={(e) => setPurchaseNote(e.target.value)}
                      rows={3}
                    />
                  </div>
                  <Button
                    onClick={handleRecordPurchase}
                    disabled={!purchaseAmount || Number(purchaseAmount) <= 0}
                    className="w-full"
                  >
                    Record Purchase
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>

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
                    {transaction.note && <p className="text-sm font-semibold mt-2">{transaction.note}</p>}
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
