"use client"

import { useEffect, useState } from "react"
import { StockTable } from "@/components/stock/stock-table"
import { AddStockDialog } from "@/components/stock/add-stock-dialog"
import { ManageHierarchyDialog } from "@/components/stock/manage-hierarchy-dialog"
import { StockFilters } from "@/components/stock/stock-filters"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Package, AlertTriangle, TrendingUp } from "lucide-react"
import { createStockItem, deleteStockItem, getStockItemDisplay, getStockItems, StockItem } from "@/lib/dataProvider"

export default function StockPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [brandFilter, setBrandFilter] = useState("all")
  const [stockFilter, setStockFilter] = useState("all")

  const [stockItems, setStockItems] = useState<StockItem[]>([])
  const [refreshKey, setRefreshKey] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchItems() {
      try {
        setLoading(true)
        const data = await getStockItems()
        setStockItems(data)
      } catch (error) {
        console.error("Failed to fetch stock items:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchItems()
  }, [refreshKey]) 

  const handleAddStock = async (newItem: StockItem) => {
    await createStockItem(newItem);
    setRefreshKey((prev) => prev + 1)
  }

  const handleHierarchyUpdate = () => {
    setRefreshKey((prev) => prev + 1)
  }

  const handleDeleteStock = async (item: StockItem) => {
    if (confirm(`Are you sure you want to delete ${getStockItemDisplay(item)}?`)) {
      await deleteStockItem(item._id)
       setRefreshKey((prev) => prev + 1)
    }
  }

  // Filter items
  const filteredItems = stockItems.filter((item) => {
    const matchesSearch = getStockItemDisplay(item).toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = categoryFilter === "all" || item.categoryId?.name === categoryFilter
    const matchesBrand = brandFilter === "all" || item.brandId?.name === brandFilter
    const matchesStock =
      stockFilter === "all" ||
      (stockFilter === "low" && item.quantityInDozen <= item.lowStockThreshold) ||
      (stockFilter === "in-stock" && item.quantityInDozen > item.lowStockThreshold)

    return matchesSearch && matchesCategory && matchesBrand && matchesStock
  })

  const totalItems = stockItems.length
  const lowStockItems = stockItems.filter((item) => item.quantityInDozen <= item.lowStockThreshold).length
  const totalValue = stockItems.reduce((sum, item) => sum + item.quantityInDozen * item.pricePerDozen, 0)

  return (
    <div className="container mx-auto p-4 sm:p-6 space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Stock Management</h1>
          <p className="text-sm sm:text-base text-muted-foreground">Manage your inventory and track stock levels</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <ManageHierarchyDialog onUpdate={handleHierarchyUpdate} />
          <AddStockDialog onAdd={handleAddStock} />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Items</CardTitle>
            <Package className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalItems}</div>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">Stock items in inventory</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Stock Alerts</CardTitle>
            <AlertTriangle className="h-5 w-5 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{lowStockItems}</div>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">Items need restocking</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Stock Value</CardTitle>
            <TrendingUp className="h-5 w-5 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Rs. {totalValue.toLocaleString()}</div>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">Current inventory value</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <StockFilters
        searchTerm={searchTerm}
        categoryFilter={categoryFilter}
        brandFilter={brandFilter}
        stockFilter={stockFilter}
        onSearchChange={setSearchTerm}
        onCategoryChange={setCategoryFilter}
        onBrandChange={setBrandFilter}
        onStockFilterChange={setStockFilter}
      />

      {/* Stock Table */}
      <StockTable items={filteredItems} onDelete={handleDeleteStock} />
    </div>
  )
}
