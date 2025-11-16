"use client"

import { useState, useEffect } from "react"
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
import { Settings, Plus, Trash2 } from "lucide-react"

import {
  getCategories,
  createCategory,
  deleteCategory,
  getBrands,
  createBrand,
  deleteBrand,
  getItemTypes,
  createItemType,
  deleteItemType,
  getSizes,
  createSize,
  deleteSize,
} from "@/lib/dataProvider"

import type { Category, Brand, ItemType, Size } from "@/lib/dataProvider"

interface ManageHierarchyDialogProps {
  onUpdate?: () => void
}

export function ManageHierarchyDialog({ onUpdate }: ManageHierarchyDialogProps) {
  const [open, setOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("categories")

  // Data lists
  const [categories, setCategories] = useState<Category[]>([])
  const [brands, setBrands] = useState<Brand[]>([])
  const [itemTypes, setItemTypes] = useState<ItemType[]>([])
  const [sizes, setSizes] = useState<Size[]>([])

  // Form states
  const [newCategoryName, setNewCategoryName] = useState("")
  const [newCategoryDesc, setNewCategoryDesc] = useState("")
  const [newBrandName, setNewBrandName] = useState("")
  const [newBrandCategory, setNewBrandCategory] = useState("")
  const [newTypeName, setNewTypeName] = useState("")
  const [newTypeBrand, setNewTypeBrand] = useState("")
  const [newSizeName, setNewSizeName] = useState("")

  const [loading, setLoading] = useState(false)

  // ---------- Fetch all data ----------
  const loadData = async () => {
    try {
      setLoading(true)
      const [catRes, brandRes, typeRes, sizeRes] = await Promise.all([
        getCategories(),
        getBrands(),
        getItemTypes(),
        getSizes(),
      ])
      setCategories(catRes)
      setBrands(brandRes)
      setItemTypes(typeRes)
      setSizes(sizeRes)
    } catch (error) {
      console.error("Failed to load data:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (open) loadData()
  }, [open])

  // ---------- Add / Delete Handlers ----------

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault()
    await createCategory({ name: newCategoryName, description: newCategoryDesc })
    setNewCategoryName("")
    setNewCategoryDesc("")
    loadData()
    onUpdate?.()
  }

  const handleDeleteCategory = async (id: string) => {
    if (confirm("Are you sure you want to delete this category?")) {
      await deleteCategory(id)
      loadData()
    }
  }

  const handleAddBrand = async (e: React.FormEvent) => {
    e.preventDefault()
    await createBrand({ name: newBrandName, categoryId: newBrandCategory })
    setNewBrandName("")
    setNewBrandCategory("")
    loadData()
    onUpdate?.()
  }

  const handleDeleteBrand = async (id: string) => {
    if (confirm("Are you sure you want to delete this brand?")) {
      await deleteBrand(id)
      loadData()
    }
  }

  const handleAddType = async (e: React.FormEvent) => {
    e.preventDefault()
    await createItemType({ name: newTypeName, brandId: newTypeBrand })
    setNewTypeName("")
    setNewTypeBrand("")
    loadData()
    onUpdate?.()
  }

  const handleDeleteType = async (id: string) => {
    if (confirm("Are you sure you want to delete this type?")) {
      await deleteItemType(id)
      loadData()
    }
  }

  const handleAddSize = async (e: React.FormEvent) => {
    e.preventDefault()
    await createSize({ name: newSizeName })
    setNewSizeName("")
    loadData()
    onUpdate?.()
  }

  const handleDeleteSize = async (id: string) => {
    if (confirm("Are you sure you want to delete this size?")) {
      await deleteSize(id)
      loadData()
    }
  }

  // ---------- UI ----------
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
          <DialogDescription>
            Add or remove categories, brands, types, and sizes for your inventory.
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="text-center py-10 text-muted-foreground">Loading data...</div>
        ) : (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="categories">Categories</TabsTrigger>
              <TabsTrigger value="brands">Brands</TabsTrigger>
              <TabsTrigger value="types">Types</TabsTrigger>
              <TabsTrigger value="sizes">Sizes</TabsTrigger>
            </TabsList>

            {/* --- Categories --- */}
            <TabsContent value="categories" className="space-y-4">
              <form onSubmit={handleAddCategory} className="space-y-3">
                <Label>Category Name</Label>
                <Input
                  placeholder="e.g. Vest"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  required
                />
                <Label>Description</Label>
                <Input
                  placeholder="e.g. All types of vests"
                  value={newCategoryDesc}
                  onChange={(e) => setNewCategoryDesc(e.target.value)}
                />
                <Button type="submit" size="sm">
                  <Plus className="mr-2 h-4 w-4" /> Add Category
                </Button>
              </form>

              <div className="border rounded-lg divide-y">
                {categories.map((cat) => (
                  <div key={cat._id} className="p-3 flex items-center justify-between hover:bg-muted/50">
                    <div>
                      <p className="font-medium">{cat.name}</p>
                      {cat.description && (
                        <p className="text-sm text-muted-foreground">{cat.description}</p>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteCategory(cat._id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </TabsContent>

            {/* --- Brands --- */}
            <TabsContent value="brands" className="space-y-4">
              <form onSubmit={handleAddBrand} className="space-y-3">
                <Label>Brand Name</Label>
                <Input
                  placeholder="e.g. Gull"
                  value={newBrandName}
                  onChange={(e) => setNewBrandName(e.target.value)}
                  required
                />
                <Label>Category</Label>
                <Select value={newBrandCategory} onValueChange={setNewBrandCategory} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat._id} value={cat._id}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button type="submit" size="sm">
                  <Plus className="mr-2 h-4 w-4" /> Add Brand
                </Button>
              </form>

              <div className="border rounded-lg divide-y">
                {brands.map((brand) => (
                  <div key={brand._id} className="p-3 flex items-center justify-between hover:bg-muted/50">
                    <div>
                      <p className="font-medium">{brand.name}</p>
                      <p className="text-sm text-muted-foreground">
                        Category: {categories.find((c) => c._id === brand.categoryId)?.name || "Unknown"}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteBrand(brand._id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </TabsContent>

            {/* --- Types --- */}
            <TabsContent value="types" className="space-y-4">
              <form onSubmit={handleAddType} className="space-y-3">
                <Label>Type Name</Label>
                <Input
                  placeholder="e.g. Sando"
                  value={newTypeName}
                  onChange={(e) => setNewTypeName(e.target.value)}
                  required
                />
                <Label>Brand</Label>
                <Select value={newTypeBrand} onValueChange={setNewTypeBrand} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select brand" />
                  </SelectTrigger>
                  <SelectContent>
                    {brands.map((brand) => (
                      <SelectItem key={brand._id} value={brand._id}>
                        {brand.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button type="submit" size="sm">
                  <Plus className="mr-2 h-4 w-4" /> Add Type
                </Button>
              </form>

              <div className="border rounded-lg divide-y">
                {itemTypes.map((type) => (
                  <div key={type._id} className="p-3 flex items-center justify-between hover:bg-muted/50">
                    <div>
                      <p className="font-medium">{type.name}</p>
                      <p className="text-sm text-muted-foreground">
                        Brand: {brands.find((b) => b._id === type.brandId)?.name || "Unknown"}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteType(type._id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </TabsContent>

            {/* --- Sizes --- */}
            <TabsContent value="sizes" className="space-y-4">
              <form onSubmit={handleAddSize} className="space-y-3">
                <Label>Size Name</Label>
                <Input
                  placeholder="e.g. 18/22"
                  value={newSizeName}
                  onChange={(e) => setNewSizeName(e.target.value)}
                  required
                />
                <Button type="submit" size="sm">
                  <Plus className="mr-2 h-4 w-4" /> Add Size
                </Button>
              </form>

              <div className="border rounded-lg divide-y">
                {sizes.map((size) => (
                  <div key={size._id} className="p-3 flex items-center justify-between hover:bg-muted/50">
                    <p className="font-medium">{size.name}</p>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteSize(size._id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
