"use client"

import { useState } from "react"
import { CustomerCard } from "@/components/customers/customer-card"
import { CustomerDetailsDialog } from "@/components/customers/customer-details-dialog"
import { customers } from "@/lib/data-store"
import type { Customer } from "@/lib/types"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Search, Users, AlertCircle, TrendingUp, UserPlus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { AddCustomerDialog } from "@/components/customers/add-customer-dialog"

export default function CustomersPage() {
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [refreshKey, setRefreshKey] = useState(0);

  const filteredCustomers = customers.filter((customer) => {
    const matchesSearch =
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.phoneNumber.includes(searchTerm) ||
      customer.shopName?.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "pending" && customer.pendingPayment > 0) ||
      (statusFilter === "clear" && customer.pendingPayment === 0)

    return matchesSearch && matchesStatus
  })

  const totalCustomers = customers.length
  const customersWithPending = customers.filter((c) => c.pendingPayment > 0).length
  const totalPendingAmount = customers.reduce((sum, c) => sum + c.pendingPayment, 0)

  return (
    <div className="container mx-auto p-4 sm:p-6 space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Customers</h1>
          <p className="text-sm sm:text-base text-muted-foreground">Manage customer information and transactions</p>
        </div>
        <Button onClick={() => setShowAddDialog(true)} className="w-full sm:w-auto">
          <UserPlus className="h-4 w-4 mr-2" />
          Add Customer
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
            <Users className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCustomers}</div>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">Active customers</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">With Pending Payments</CardTitle>
            <AlertCircle className="h-5 w-5 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{customersWithPending}</div>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">Need to receive payment</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Receivables</CardTitle>
            <TrendingUp className="h-5 w-5 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Rs. {totalPendingAmount.toLocaleString()}</div>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">Amount to receive</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="search">Search Customers</Label>
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
              <SelectValue placeholder="All customers" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All customers</SelectItem>
              <SelectItem value="pending">With pending payments</SelectItem>
              <SelectItem value="clear">No pending payments</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Customer Cards Grid */}
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3" key={refreshKey}>
        {filteredCustomers.length === 0 ? (
          <div className="col-span-full text-center py-12 text-muted-foreground">No customers found</div>
        ) : (
          filteredCustomers.map((customer) => (
            <CustomerCard key={customer.id} customer={customer} onClick={() => setSelectedCustomer(customer)} />
          ))
        )}
      </div>

      {/* Customer Details Dialog */}
      <CustomerDetailsDialog
        customer={selectedCustomer}
        open={!!selectedCustomer}
        onOpenChange={(open) => !open && setSelectedCustomer(null)}
      />

      {/* AddCustomerDialog component */}
      <AddCustomerDialog
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        onCustomerAdded={() => setRefreshKey((k) => k + 1)}
      />
    </div>
  )
}
