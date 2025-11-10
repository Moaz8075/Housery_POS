"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { customers } from "@/lib/data-store"

interface CheckoutFormProps {
  subtotal: number
  onComplete: (data: CheckoutData) => void
  disabled?: boolean
}

export interface CheckoutData {
  customerType: "existing" | "new" | "walk-in"
  customerId?: string
  customerName?: string
  phoneNumber?: string
  shopName?: string
  amountPaid: number
  note?: string
}

export function CheckoutForm({ subtotal, onComplete, disabled }: CheckoutFormProps) {
  const [customerType, setCustomerType] = useState<"existing" | "new" | "walk-in">("walk-in")
  const [customerId, setCustomerId] = useState("")
  const [customerName, setCustomerName] = useState("")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [shopName, setShopName] = useState("")
  const [amountPaid, setAmountPaid] = useState(subtotal.toString())
  const [note, setNote] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const data: CheckoutData = {
      customerType,
      amountPaid: Number(amountPaid),
      note,
    }

    if (customerType === "existing") {
      data.customerId = customerId
    } else if (customerType === "new") {
      data.customerName = customerName
      data.phoneNumber = phoneNumber
      data.shopName = shopName
    }

    onComplete(data)
  }

  const pendingAmount = subtotal - Number(amountPaid)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Checkout</CardTitle>
        <CardDescription>Complete the sale and choose customer</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Customer Type Selection */}
          <div className="space-y-3">
            <Label>Customer Type</Label>
            <RadioGroup value={customerType} onValueChange={(value: any) => setCustomerType(value)}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="walk-in" id="walk-in" />
                <Label htmlFor="walk-in" className="font-normal cursor-pointer">
                  Walk-in Customer (No record)
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="existing" id="existing" />
                <Label htmlFor="existing" className="font-normal cursor-pointer">
                  Existing Customer
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="new" id="new" />
                <Label htmlFor="new" className="font-normal cursor-pointer">
                  New Customer
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Existing Customer Selection */}
          {customerType === "existing" && (
            <div className="space-y-2">
              <Label htmlFor="customer">Select Customer</Label>
              <Select value={customerId} onValueChange={setCustomerId} required>
                <SelectTrigger id="customer">
                  <SelectValue placeholder="Choose a customer" />
                </SelectTrigger>
                <SelectContent>
                  {customers.map((customer) => (
                    <SelectItem key={customer.id} value={customer.id}>
                      {customer.name} - {customer.phoneNumber}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* New Customer Form */}
          {customerType === "new" && (
            <div className="space-y-4 border rounded-lg p-4 bg-muted/30">
              <div className="space-y-2">
                <Label htmlFor="name">Customer Name *</Label>
                <Input id="name" value={customerName} onChange={(e) => setCustomerName(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number *</Label>
                <Input id="phone" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="shop">Shop Name (Optional)</Label>
                <Input id="shop" value={shopName} onChange={(e) => setShopName(e.target.value)} />
              </div>
            </div>
          )}

          {/* Payment Section */}
          <div className="space-y-4 border-t pt-4">
            <div className="space-y-2">
              <Label htmlFor="amount-paid">Amount Paid (Rs.)</Label>
              <Input
                id="amount-paid"
                type="number"
                min="0"
                max={subtotal}
                step="1"
                value={amountPaid}
                onChange={(e) => setAmountPaid(e.target.value)}
                required
              />
              <div className="text-xs space-y-1">
                <p className="text-muted-foreground">Total: Rs. {subtotal.toLocaleString()}</p>
                {pendingAmount > 0 && (
                  <p className="text-orange-600 font-medium">Pending: Rs. {pendingAmount.toLocaleString()}</p>
                )}
                {pendingAmount === 0 && <p className="text-green-600 font-medium">Fully Paid</p>}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="note">Note (Optional)</Label>
              <Textarea
                id="note"
                placeholder="Add any additional notes..."
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={3}
              />
            </div>
          </div>

          <Button type="submit" className="w-full" size="lg" disabled={disabled}>
            Complete Sale
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
