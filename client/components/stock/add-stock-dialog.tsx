"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { categories, brands, itemTypes, sizes } from "@/lib/data-store"
import { Plus } from "lucide-react"

interface AddStockDialogProps {
  onAdd?: (data: any) => void
}

export function AddStockDialog({ onAdd }: AddStockDialogProps) {
  const [open, setOpen] = useState(false)
  const [categoryId, setCategoryId] = useState("")
  const [brandId, setBrandId] = useState("")
  const [typeId, setTypeId] = useState("")
  const [sizeId, setSizeId] = useState("")
  const [quantityInDozen, setQuantityInDozen] = useState("")
  const [pricePerDozen, setPricePerDozen] = useState("")
  const [lowStockThreshold, setLowStockThreshold] = useState("10")

  const filteredBrands = brands.filter((b) => b.categoryId === categoryId)
  const filteredTypes = itemTypes.filter((t) => t.brandId === brandId)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const pricePerPiece = Math.round(Number(pricePerDozen) / 12)

    const newItem = {
      id: `stock-${Date.now()}`,
      categoryId,
      brandId,
      typeId,
      sizeId,
      quantityInDozen: Number(quantityInDozen),
      pricePerDozen: Number(pricePerDozen),
      pricePerPiece,
      lowStockThreshold: Number(lowStockThreshold),
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    onAdd?.(newItem)
    setOpen(false)

    // Reset form
    setCategoryId("")
    setBrandId("")
    setTypeId("")
    setSizeId("")
    setQuantityInDozen("")
    setPricePerDozen("")
    setLowStockThreshold("10")
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Stock Item
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Add New Stock Item</DialogTitle>
          <DialogDescription>Add a new item to your inventory. Fill in all the required details.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select value={categoryId} onValueChange={setCategoryId} required>
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
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
                <Select value={brandId} onValueChange={setBrandId} disabled={!categoryId} required>
                  <SelectTrigger id="brand">
                    <SelectValue placeholder="Select brand" />
                  </SelectTrigger>
                  <SelectContent>
                    {filteredBrands.map((brand) => (
                      <SelectItem key={brand.id} value={brand.id}>
                        {brand.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="type">Type</Label>
                <Select value={typeId} onValueChange={setTypeId} disabled={!brandId} required>
                  <SelectTrigger id="type">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {filteredTypes.map((type) => (
                      <SelectItem key={type.id} value={type.id}>
                        {type.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="size">Size</Label>
                <Select value={sizeId} onValueChange={setSizeId} required>
                  <SelectTrigger id="size">
                    <SelectValue placeholder="Select size" />
                  </SelectTrigger>
                  <SelectContent>
                    {sizes.map((size) => (
                      <SelectItem key={size.id} value={size.id}>
                        {size.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="quantity">Quantity (Dozen)</Label>
                <Input
                  id="quantity"
                  type="number"
                  min="0"
                  step="1"
                  value={quantityInDozen}
                  onChange={(e) => setQuantityInDozen(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="price">Price per Dozen (Rs.)</Label>
                <Input
                  id="price"
                  type="number"
                  min="0"
                  step="1"
                  value={pricePerDozen}
                  onChange={(e) => setPricePerDozen(e.target.value)}
                  required
                />
                {pricePerDozen && (
                  <p className="text-xs text-muted-foreground">
                    Per piece: Rs. {Math.round(Number(pricePerDozen) / 12)}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="threshold">Low Stock Alert (Dozen)</Label>
                <Input
                  id="threshold"
                  type="number"
                  min="0"
                  step="1"
                  value={lowStockThreshold}
                  onChange={(e) => setLowStockThreshold(e.target.value)}
                  required
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Add Stock</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
