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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { categories, brands, itemTypes, sizes } from "@/lib/data-store"
import { Settings, Plus, Trash2 } from "lucide-react"
import type { Category, Brand, ItemType, Size } from "@/lib/types"

interface ManageHierarchyDialogProps {
  onUpdate?: () => void
}

export function ManageHierarchyDialog({ onUpdate }: ManageHierarchyDialogProps) {
  const [open, setOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("categories")

  // Category states
  const [newCategoryName, setNewCategoryName] = useState("")
  const [newCategoryDesc, setNewCategoryDesc] = useState("")

  // Brand states
  const [newBrandName, setNewBrandName] = useState("")
  const [newBrandCategory, setNewBrandCategory] = useState("")

  // Type states
  const [newTypeName, setNewTypeName] = useState("")
  const [newTypeBrand, setNewTypeBrand] = useState("")

  // Size states
  const [newSizeName, setNewSizeName] = useState("")

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault()
    const newCategory: Category = {
      id: `cat-${Date.now()}`,
      name: newCategoryName,
      description: newCategoryDesc,
    }
    categories.push(newCategory)
    setNewCategoryName("")
    setNewCategoryDesc("")
    onUpdate?.()
  }

  const handleAddBrand = (e: React.FormEvent) => {
    e.preventDefault()
    const newBrand: Brand = {
      id: `brand-${Date.now()}`,
      name: newBrandName,
      categoryId: newBrandCategory,
    }
    brands.push(newBrand)
    setNewBrandName("")
    setNewBrandCategory("")
    onUpdate?.()
  }

  const handleAddType = (e: React.FormEvent) => {
    e.preventDefault()
    const newType: ItemType = {
      id: `type-${Date.now()}`,
      name: newTypeName,
      brandId: newTypeBrand,
    }
    itemTypes.push(newType)
    setNewTypeName("")
    setNewTypeBrand("")
    onUpdate?.()
  }

  const handleAddSize = (e: React.FormEvent) => {
    e.preventDefault()
    const newSize: Size = {
      id: `size-${Date.now()}`,
      name: newSizeName,
    }
    sizes.push(newSize)
    setNewSizeName("")
    onUpdate?.()
  }

  const handleDeleteCategory = (id: string) => {
    if (confirm("Are you sure? This will affect related brands and items.")) {
      const index = categories.findIndex((c) => c.id === id)
      if (index > -1) {
        categories.splice(index, 1)
        onUpdate?.()
      }
    }
  }

  const handleDeleteBrand = (id: string) => {
    if (confirm("Are you sure? This will affect related types and items.")) {
      const index = brands.findIndex((b) => b.id === id)
      if (index > -1) {
        brands.splice(index, 1)
        onUpdate?.()
      }
    }
  }

  const handleDeleteType = (id: string) => {
    if (confirm("Are you sure? This will affect related items.")) {
      const index = itemTypes.findIndex((t) => t.id === id)
      if (index > -1) {
        itemTypes.splice(index, 1)
        onUpdate?.()
      }
    }
  }

  const handleDeleteSize = (id: string) => {
    if (confirm("Are you sure? This will affect related items.")) {
      const index = sizes.findIndex((s) => s.id === id)
      if (index > -1) {
        sizes.splice(index, 1)
        onUpdate?.()
      }
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Settings className="mr-2 h-4 w-4" />
          Manage Hierarchy
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Manage Stock Hierarchy</DialogTitle>
          <DialogDescription>Add or remove categories, brands, types, and sizes for your inventory.</DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="categories">Categories</TabsTrigger>
            <TabsTrigger value="brands">Brands</TabsTrigger>
            <TabsTrigger value="types">Types</TabsTrigger>
            <TabsTrigger value="sizes">Sizes</TabsTrigger>
          </TabsList>

          {/* Categories Tab */}
          <TabsContent value="categories" className="space-y-4">
            <form onSubmit={handleAddCategory} className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="cat-name">Category Name</Label>
                <Input
                  id="cat-name"
                  placeholder="e.g., Vest"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cat-desc">Description (Optional)</Label>
                <Input
                  id="cat-desc"
                  placeholder="e.g., All types of vests"
                  value={newCategoryDesc}
                  onChange={(e) => setNewCategoryDesc(e.target.value)}
                />
              </div>
              <Button type="submit" size="sm">
                <Plus className="mr-2 h-4 w-4" />
                Add Category
              </Button>
            </form>

            <div className="border rounded-lg divide-y">
              {categories.map((cat) => (
                <div key={cat.id} className="p-3 flex items-center justify-between hover:bg-muted/50">
                  <div>
                    <p className="font-medium">{cat.name}</p>
                    {cat.description && <p className="text-sm text-muted-foreground">{cat.description}</p>}
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteCategory(cat.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </TabsContent>

          {/* Brands Tab */}
          <TabsContent value="brands" className="space-y-4">
            <form onSubmit={handleAddBrand} className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="brand-name">Brand Name</Label>
                <Input
                  id="brand-name"
                  placeholder="e.g., Gull"
                  value={newBrandName}
                  onChange={(e) => setNewBrandName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="brand-cat">Category</Label>
                <Select value={newBrandCategory} onValueChange={setNewBrandCategory} required>
                  <SelectTrigger id="brand-cat">
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
              <Button type="submit" size="sm">
                <Plus className="mr-2 h-4 w-4" />
                Add Brand
              </Button>
            </form>

            <div className="border rounded-lg divide-y">
              {brands.map((brand) => {
                const category = categories.find((c) => c.id === brand.categoryId)
                return (
                  <div key={brand.id} className="p-3 flex items-center justify-between hover:bg-muted/50">
                    <div>
                      <p className="font-medium">{brand.name}</p>
                      <p className="text-sm text-muted-foreground">Category: {category?.name || "Unknown"}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteBrand(brand.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                )
              })}
            </div>
          </TabsContent>

          {/* Types Tab */}
          <TabsContent value="types" className="space-y-4">
            <form onSubmit={handleAddType} className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="type-name">Type Name</Label>
                <Input
                  id="type-name"
                  placeholder="e.g., Sando"
                  value={newTypeName}
                  onChange={(e) => setNewTypeName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="type-brand">Brand</Label>
                <Select value={newTypeBrand} onValueChange={setNewTypeBrand} required>
                  <SelectTrigger id="type-brand">
                    <SelectValue placeholder="Select brand" />
                  </SelectTrigger>
                  <SelectContent>
                    {brands.map((brand) => (
                      <SelectItem key={brand.id} value={brand.id}>
                        {brand.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button type="submit" size="sm">
                <Plus className="mr-2 h-4 w-4" />
                Add Type
              </Button>
            </form>

            <div className="border rounded-lg divide-y">
              {itemTypes.map((type) => {
                const brand = brands.find((b) => b.id === type.brandId)
                return (
                  <div key={type.id} className="p-3 flex items-center justify-between hover:bg-muted/50">
                    <div>
                      <p className="font-medium">{type.name}</p>
                      <p className="text-sm text-muted-foreground">Brand: {brand?.name || "Unknown"}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteType(type.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                )
              })}
            </div>
          </TabsContent>

          {/* Sizes Tab */}
          <TabsContent value="sizes" className="space-y-4">
            <form onSubmit={handleAddSize} className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="size-name">Size Name</Label>
                <Input
                  id="size-name"
                  placeholder="e.g., 18/22"
                  value={newSizeName}
                  onChange={(e) => setNewSizeName(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" size="sm">
                <Plus className="mr-2 h-4 w-4" />
                Add Size
              </Button>
            </form>

            <div className="border rounded-lg divide-y">
              {sizes.map((size) => (
                <div key={size.id} className="p-3 flex items-center justify-between hover:bg-muted/50">
                  <div>
                    <p className="font-medium">{size.name}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteSize(size.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
