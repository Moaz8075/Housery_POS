"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Trash2, ShoppingCart } from "lucide-react"
import { getStockItems, SaleItem, StockItem } from "@/lib/dataProvider"
import { useEffect, useState } from "react"
import { getStockItemDisplay } from "@/lib/data-store"

interface CartProps {
  items: (SaleItem & { id: string })[]
  onRemoveItem: (id: string) => void
  onClearCart: () => void
}

export function Cart({ items, onRemoveItem, onClearCart }: CartProps) {
  const subtotal = items.reduce((sum, item) => sum + item.subtotal, 0)
  const totalPieces = items.reduce((sum, item) => sum + item.quantity * 12, 0)
  const [stockItems, setStockItems] = useState<StockItem[]>([])

  // Fetch stock items on mount
  useEffect(() => {
    async function loadStockItems() {
      try {
        const data = await getStockItems()
        setStockItems(data)
      } catch (error) {
        console.error("Failed to fetch stock items", error)
      }
    }
    loadStockItems()
  }, [])

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5" />
              Cart
            </CardTitle>
            <CardDescription>{items.length} items</CardDescription>
          </div>
          {items.length > 0 && (
            <Button variant="ghost" size="sm" onClick={onClearCart}>
              Clear All
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col">
        {items.length === 0 ? (
          <div className="flex-1 flex items-center justify-center text-center">
            <div className="space-y-2">
              <ShoppingCart className="h-12 w-12 mx-auto text-muted-foreground" />
              <p className="text-muted-foreground">Cart is empty</p>
              <p className="text-xs text-muted-foreground">Select items to add to cart</p>
            </div>
          </div>
        ) : (
          <>
            <div className="flex-1 space-y-3 overflow-y-auto mb-4">
              {items.map((item) => {
                // const stockItem = typeof item.item === "object" && item.item !== null
                //   ? stockItems.find((s) => s._id === item.item._id) // if item.item is populated
                //   : stockItems.find((s) => s._id === item.item)     // if item.item is just an ID string

                // if (!stockItem) return null

                return (
                  <div key={item.id} className="border rounded-lg p-3">
                    <div className="flex justify-between items-start mb-2">
                      <p className="font-medium text-sm flex-1">{getStockItemDisplay(item.item)}</p>
                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => onRemoveItem(item.id)}>
                        <Trash2 className="h-4 w-4 text-red-600" />
                      </Button>
                    </div>
                    <div className="space-y-1 text-xs">
                      <div className="flex justify-between text-muted-foreground">
                        <span>
                          {item.quantity} dozen × Rs. {item.unitPrice.toLocaleString()}
                        </span>
                        <span className="font-medium text-foreground">Rs. {item.subtotal.toLocaleString()}</span>
                      </div>
                      <p className="text-muted-foreground">
                        {item.quantity * 12} pieces @ Rs. {item.unitPrice / 12}/piece
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="space-y-3 border-t pt-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Total Pieces:</span>
                  <span className="font-medium">{totalPieces}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold">Subtotal:</span>
                  <span className="text-xl font-bold">Rs. {subtotal.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
