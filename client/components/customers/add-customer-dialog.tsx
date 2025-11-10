"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { customers } from "@/lib/data-store"
import type { Customer } from "@/lib/types"

interface AddCustomerDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCustomerAdded?: () => void
}

export function AddCustomerDialog({ open, onOpenChange, onCustomerAdded }: AddCustomerDialogProps) {
  const [formData, setFormData] = useState({
    name: "",
    phoneNumber: "",
    shopName: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const newCustomer: Customer = {
      id: `cust-${Date.now()}`,
      name: formData.name,
      phoneNumber: formData.phoneNumber,
      shopName: formData.shopName || undefined,
      totalPurchases: 0,
      pendingPayment: 0,
      createdAt: new Date(),
    }

    customers.push(newCustomer)

    setFormData({ name: "", phoneNumber: "", shopName: "" })
    onOpenChange(false)
    onCustomerAdded?.()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Customer</DialogTitle>
          <DialogDescription>Create a new customer profile for tracking sales and payments</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">
              Customer Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="name"
              placeholder="Enter customer name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">
              Phone Number <span className="text-red-500">*</span>
            </Label>
            <Input
              id="phone"
              placeholder="+92 300 1234567"
              value={formData.phoneNumber}
              onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="shop">Shop Name (Optional)</Label>
            <Input
              id="shop"
              placeholder="Enter shop name"
              value={formData.shopName}
              onChange={(e) => setFormData({ ...formData, shopName: e.target.value })}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" className="flex-1">
              Add Customer
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
