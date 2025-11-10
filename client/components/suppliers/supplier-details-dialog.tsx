"use client"

import { useState } from "react"
import type { Supplier } from "@/lib/types"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Phone, Store, CreditCard, Package, Plus } from "lucide-react"

interface SupplierDetailsDialogProps {
  supplier: Supplier | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function SupplierDetailsDialog({ supplier, open, onOpenChange }: SupplierDetailsDialogProps) {
  const [paymentAmount, setPaymentAmount] = useState("")
  const [purchaseAmount, setPurchaseAmount] = useState("")
  const [purchaseNote, setPurchaseNote] = useState("")
  const [activeTab, setActiveTab] = useState("overview")

  if (!supplier) return null

  const handleMakePayment = () => {
    if (Number(paymentAmount) > 0 && Number(paymentAmount) <= supplier.pendingPayment) {
      console.log("[v0] Payment made to supplier:", {
        supplierId: supplier.id,
        amount: Number(paymentAmount),
      })
      setPaymentAmount("")
      setActiveTab("overview")
      onOpenChange(false)
    }
  }

  const handleRecordPurchase = () => {
    if (Number(purchaseAmount) > 0) {
      console.log("[v0] Purchase recorded:", {
        supplierId: supplier.id,
        amount: Number(purchaseAmount),
        note: purchaseNote,
      })
      setPurchaseAmount("")
      setPurchaseNote("")
      setActiveTab("overview")
      onOpenChange(false)
    }
  }

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
              <p className={`text-2xl font-bold ${supplier.pendingPayment > 0 ? "text-red-600" : "text-green-600"}`}>
                Rs. {supplier.pendingPayment.toLocaleString()}
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
                  {supplier.pendingPayment > 0 && (
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
                      max={supplier.pendingPayment}
                      value={paymentAmount}
                      onChange={(e) => setPaymentAmount(e.target.value)}
                      placeholder="Enter amount"
                    />
                    <p className="text-xs text-muted-foreground">
                      Pending: Rs. {supplier.pendingPayment.toLocaleString()}
                    </p>
                  </div>
                  <Button
                    onClick={handleMakePayment}
                    disabled={
                      !paymentAmount || Number(paymentAmount) <= 0 || Number(paymentAmount) > supplier.pendingPayment
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
        </div>
      </DialogContent>
    </Dialog>
  )
}
