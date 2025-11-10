"use client"

import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface PaymentFiltersProps {
  typeFilter: string
  statusFilter: string
  onTypeChange: (value: string) => void
  onStatusChange: (value: string) => void
}

export function PaymentFilters({ typeFilter, statusFilter, onTypeChange, onStatusChange }: PaymentFiltersProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div className="space-y-2">
        <Label htmlFor="type">Payment Type</Label>
        <Select value={typeFilter} onValueChange={onTypeChange}>
          <SelectTrigger id="type">
            <SelectValue placeholder="All payments" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All payments</SelectItem>
            <SelectItem value="receivable">Receivables (From Customers)</SelectItem>
            <SelectItem value="payable">Payables (To Suppliers)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="status">Payment Status</Label>
        <Select value={statusFilter} onValueChange={onStatusChange}>
          <SelectTrigger id="status">
            <SelectValue placeholder="All statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="partial">Partial</SelectItem>
            <SelectItem value="overdue">Overdue</SelectItem>
            <SelectItem value="paid">Paid</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
