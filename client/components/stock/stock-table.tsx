"use client"

import { getStockItemDisplay, getCategoryName, getBrandName, getTypeName, getSizeName } from "@/lib/data-store"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Edit, Trash2, AlertTriangle } from "lucide-react"
import { cn } from "@/lib/utils"
import { StockItem } from "@/lib/dataProvider"

interface StockTableProps {
  items: StockItem[]
  onEdit?: (item: StockItem) => void
  onDelete?: (item: StockItem) => void
}

export function StockTable({ items, onEdit, onDelete }: StockTableProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Item</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Brand</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Size</TableHead>
            <TableHead className="text-right">Quantity (Dozen)</TableHead>
            <TableHead className="text-right">Price/Dozen</TableHead>
            <TableHead className="text-right">Price/Piece</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.length === 0 ? (
            <TableRow>
              <TableCell colSpan={10} className="text-center py-8 text-muted-foreground">
                No stock items found
              </TableCell>
            </TableRow>
          ) : (
            items.map((item) => {
              const isLowStock = item.quantityInDozen <= item.lowStockThreshold
              return (
                <TableRow key={item._id} className={cn(isLowStock && "bg-yellow-50/50")}>
                  <TableCell className="font-medium">{getStockItemDisplay(item)}</TableCell>
                  <TableCell>{item.categoryId?.name}</TableCell>
                  <TableCell>{item.brandId?.name}</TableCell>
                  <TableCell>{item.typeId?.name ?? ''}</TableCell>
                  <TableCell>{item.sizeId?.name ?? ''}</TableCell>
                  <TableCell className="text-right font-medium">{item.quantityInDozen}</TableCell>
                  <TableCell className="text-right">Rs. {item.pricePerDozen.toLocaleString()}</TableCell>
                  <TableCell className="text-right">Rs. {item.pricePerPiece.toLocaleString()}</TableCell>
                  <TableCell>
                    {isLowStock ? (
                      <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-300">
                        <AlertTriangle className="w-3 h-3 mr-1" />
                        Low Stock
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">
                        In Stock
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="sm" onClick={() => onEdit?.(item)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => onDelete?.(item)}>
                        <Trash2 className="h-4 w-4 text-red-600" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              )
            })
          )}
        </TableBody>
      </Table>
    </div>
  )
}
