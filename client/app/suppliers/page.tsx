"use client"

import { useState } from "react"
import { SupplierCard } from "@/components/suppliers/supplier-card"
import { SupplierDetailsDialog } from "@/components/suppliers/supplier-details-dialog"
import { suppliers } from "@/lib/data-store"
import type { Supplier } from "@/lib/types"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Search, Truck, AlertCircle, TrendingDown, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { AddSupplierDialog } from "@/components/suppliers/add-supplier-dialog"

export default function SuppliersPage() {
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null)
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [refreshKey, setRefreshKey] = useState(0)

  const filteredSuppliers = suppliers.filter((supplier) => {
    const matchesSearch =
      supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supplier.phoneNumber.includes(searchTerm) ||
      supplier.shopName?.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "pending" && supplier.pendingPayment > 0) ||
      (statusFilter === "clear" && supplier.pendingPayment === 0)

    return matchesSearch && matchesStatus
  })

  const totalSuppliers = suppliers.length
  const suppliersWithPending = suppliers.filter((s) => s.pendingPayment > 0).length
  const totalPayableAmount = suppliers.reduce((sum, s) => sum + s.pendingPayment, 0)

  return (
    <div className="container mx-auto p-4 sm:p-6 space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Suppliers</h1>
          <p className="text-sm sm:text-base text-muted-foreground">Manage supplier information and purchases</p>
        </div>
        <Button onClick={() => setShowAddDialog(true)} className="w-full sm:w-auto">
          <Plus className="h-4 w-4 mr-2" />
          Add Supplier
        </Button>
      </div>

      <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Suppliers</CardTitle>
            <Truck className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalSuppliers}</div>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">Active suppliers</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">With Pending Payments</CardTitle>
            <AlertCircle className="h-5 w-5 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{suppliersWithPending}</div>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">Need to pay</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Payables</CardTitle>
            <TrendingDown className="h-5 w-5 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Rs. {totalPayableAmount.toLocaleString()}</div>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">Amount to pay</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="search">Search Suppliers</Label>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              id="search"
              placeholder="Search by name, phone, or shop..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="status">Payment Status</Label>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger id="status">
              <SelectValue placeholder="All suppliers" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All suppliers</SelectItem>
              <SelectItem value="pending">With pending payments</SelectItem>
              <SelectItem value="clear">No pending payments</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3" key={refreshKey}>
        {filteredSuppliers.length === 0 ? (
          <div className="col-span-full text-center py-12 text-muted-foreground">No suppliers found</div>
        ) : (
          filteredSuppliers.map((supplier) => (
            <SupplierCard key={supplier.id} supplier={supplier} onClick={() => setSelectedSupplier(supplier)} />
          ))
        )}
      </div>

      <SupplierDetailsDialog
        supplier={selectedSupplier}
        open={!!selectedSupplier}
        onOpenChange={(open) => !open && setSelectedSupplier(null)}
      />

      <AddSupplierDialog
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        onSupplierAdded={() => setRefreshKey((k) => k + 1)}
      />
    </div>
  )
}
