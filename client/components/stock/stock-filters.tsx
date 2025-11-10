"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { categories, brands } from "@/lib/data-store"
import { Search } from "lucide-react"

interface StockFiltersProps {
  searchTerm: string
  categoryFilter: string
  brandFilter: string
  stockFilter: string
  onSearchChange: (value: string) => void
  onCategoryChange: (value: string) => void
  onBrandChange: (value: string) => void
  onStockFilterChange: (value: string) => void
}

export function StockFilters({
  searchTerm,
  categoryFilter,
  brandFilter,
  stockFilter,
  onSearchChange,
  onCategoryChange,
  onBrandChange,
  onStockFilterChange,
}: StockFiltersProps) {
  return (
    <div className="grid gap-4 md:grid-cols-4">
      <div className="space-y-2">
        <Label htmlFor="search">Search</Label>
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            id="search"
            placeholder="Search items..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="category">Category</Label>
        <Select value={categoryFilter} onValueChange={onCategoryChange}>
          <SelectTrigger id="category">
            <SelectValue placeholder="All categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All categories</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat.id} value={cat.id}>
                {cat.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="brand">Brand</Label>
        <Select value={brandFilter} onValueChange={onBrandChange}>
          <SelectTrigger id="brand">
            <SelectValue placeholder="All brands" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All brands</SelectItem>
            {brands.map((brand) => (
              <SelectItem key={brand.id} value={brand.id}>
                {brand.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="stock">Stock Status</Label>
        <Select value={stockFilter} onValueChange={onStockFilterChange}>
          <SelectTrigger id="stock">
            <SelectValue placeholder="All items" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All items</SelectItem>
            <SelectItem value="low">Low stock only</SelectItem>
            <SelectItem value="in-stock">In stock only</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
