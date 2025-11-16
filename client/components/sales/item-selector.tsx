"use client"

import { useState } from "react"
import { getStockItemDisplay } from "@/lib/data-store"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Plus, Package } from "lucide-react"
import { cn } from "@/lib/utils"
import { StockItem } from "@/lib/dataProvider"

interface ItemSelectorProps {
  items: StockItem[]
  onAddToCart: (item: StockItem, quantity: number) => void
}

export function ItemSelector({ items, onAddToCart }: ItemSelectorProps) {
  const [selectedItem, setSelectedItem] = useState<StockItem | null>(null)
  const [quantity, setQuantity] = useState("1")

  const handleAddToCart = () => {
    if (selectedItem && Number(quantity) > 0) {
      onAddToCart(selectedItem, Number(quantity))
      setQuantity("1")
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold mb-3">Select Items</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-[400px] overflow-y-auto">
          {items.map((item) => {
            const isLowStock = item.quantityInDozen <= item.lowStockThreshold
            const isSelected = selectedItem?._id === item._id

            return (
              <Card
                key={item._id}
                className={cn(
                  "cursor-pointer transition-all hover:border-primary",
                  isSelected && "border-primary bg-primary/5",
                  isLowStock && "border-yellow-300",
                )}
                onClick={() => setSelectedItem(item)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <p className="font-medium text-sm leading-tight">{getStockItemDisplay(item)}</p>
                    </div>
                    {isLowStock && (
                      <Badge variant="outline" className="text-xs bg-yellow-100 text-yellow-800 border-yellow-300">
                        Low
                      </Badge>
                    )}
                  </div>
                  <div className="space-y-1 text-xs text-muted-foreground">
                    <div className="flex justify-between">
                      <span>Per Dozen:</span>
                      <span className="font-medium text-foreground">Rs. {item.pricePerDozen.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Per Piece:</span>
                      <span className="font-medium text-foreground">Rs. {item.pricePerPiece.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center pt-1 border-t">
                      <span>In Stock:</span>
                      <span className="font-medium text-foreground flex items-center gap-1">
                        <Package className="h-3 w-3" />
                        {item.quantityInDozen} dz
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>

      {selectedItem && (
        <Card className="border-primary">
          <CardHeader>
            <CardTitle className="text-base">Add to Cart</CardTitle>
            <CardDescription>{getStockItemDisplay(selectedItem)}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="quantity">Quantity (Dozen)</Label>
                  <Input
                    id="quantity"
                    type="number"
                    min="1"
                    max={selectedItem.quantityInDozen}
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">Available: {selectedItem.quantityInDozen} dozen</p>
                </div>
                <div className="space-y-2">
                  <Label>Total Amount</Label>
                  <div className="h-10 flex items-center">
                    <p className="text-2xl font-bold">
                      Rs. {(Number(quantity) * selectedItem.pricePerDozen).toLocaleString()}
                    </p>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {Number(quantity) * 12} pieces @ Rs. {selectedItem.pricePerPiece}/piece
                  </p>
                </div>
              </div>
              <Button
                onClick={handleAddToCart}
                disabled={Number(quantity) <= 0 || Number(quantity) > selectedItem.quantityInDozen}
                className="w-full"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add to Cart
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
