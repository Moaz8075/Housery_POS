"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { createCustomer, getCustomers } from "@/lib/dataProvider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"

interface Customer {
  _id: string
  name: string
  phoneNumber: string
  shopName?: string
}

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
  tax?: number
  discount?: number
  paymentMethod?: "cash" | "card" | "mobile" | "credit"
  note?: string
  status?: "draft" | "completed" | "cancelled"
}

export function CheckoutForm({ subtotal, onComplete, disabled }: CheckoutFormProps) {
  const [customers, setCustomers] = useState<any[]>([])
  const [loadingCustomers, setLoadingCustomers] = useState(true)

  // FORM STATES
  const [customerType, setCustomerType] = useState<"existing" | "new" | "walk-in">("walk-in")
  const [customerId, setCustomerId] = useState("")
  const [customerName, setCustomerName] = useState("")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [shopName, setShopName] = useState("")
  const [amountPaid, setAmountPaid] = useState(subtotal.toString())
  const [note, setNote] = useState("")
  const [addingCustomer, setAddingCustomer] = useState(false)

  // LOAD CUSTOMERS
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getCustomers()
        setCustomers(res)
      } finally {
        setLoadingCustomers(false)
      }
    }
    fetchData()
  }, [])

  // ADD NEW CUSTOMER FIRST
  const handleAddCustomer = async () => {
    if (!customerName || !phoneNumber) return

    setAddingCustomer(true)
    try {
      const newCustomer = await createCustomer({
        name: customerName,
        phoneNumber,
        shopName,
      })

      // ADD NEW CUSTOMER TO LIST
      setCustomers((prev) => [...prev, newCustomer])

      // AUTO SELECT NEW CUSTOMER
      setCustomerId(newCustomer._id)

      // SWITCH TO EXISTING
      setCustomerType("existing")
    } finally {
      setAddingCustomer(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const data: CheckoutData = {
      customerType,
      amountPaid: Number(amountPaid),
      note,
    }

    if (customerType === "existing") {
      data.customerId = customerId
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

          {/* Customer Type */}
          <div className="space-y-3">
            <Label>Customer Type</Label>
            <RadioGroup
              value={customerType}
              onValueChange={(value) =>
                setCustomerType(value as "existing" | "new" | "walk-in")
              }
            >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="walk-in" id="walk-in" />
              <Label htmlFor="walk-in" className="font-normal cursor-pointer">
                Walk-in Customer
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

        {/* Existing Customers */}
        {customerType === "existing" && (
          <div className="space-y-2">
            <Label>Select Customer</Label>

            <Select value={customerId} onValueChange={setCustomerId} required>
              <SelectTrigger>
                <SelectValue placeholder={loadingCustomers ? "Loading..." : "Choose a customer"} />
              </SelectTrigger>
              <SelectContent>
                {customers.map((c) => (
                  <SelectItem key={c._id} value={c._id}>
                    {c.name} — {c.phoneNumber}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* New Customer */}
        {customerType === "new" && (
          <div className="space-y-4 border rounded-lg p-4 bg-muted/30">
            <div>
              <Label>Name</Label>
              <Input value={customerName} onChange={(e) => setCustomerName(e.target.value)} required />
            </div>

            <div>
              <Label>Phone</Label>
              <Input value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} required />
            </div>

            <div>
              <Label>Shop</Label>
              <Input value={shopName} onChange={(e) => setShopName(e.target.value)} />
            </div>

            <Button
              type="button"
              onClick={handleAddCustomer}
              disabled={addingCustomer}
              className="w-full"
            >
              {addingCustomer ? "Adding..." : "Add Customer"}
            </Button>
          </div>
        )}

        {/* Payment */}
        <div className="space-y-4 border-t pt-4">
          <Label>Amount Paid</Label>
          <Input
            type="number"
            value={amountPaid}
            onChange={(e) => setAmountPaid(e.target.value)}
            required
          />
          {pendingAmount > 0 && <p className="text-orange-500">Pending: Rs {pendingAmount}</p>}
        </div>

        <Button type="submit" className="w-full" size="lg" disabled={disabled}>
          Complete Sale
        </Button>
      </form>
    </CardContent>
    </Card >
  )
}
