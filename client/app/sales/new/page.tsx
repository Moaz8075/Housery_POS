"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ItemSelector } from "@/components/sales/item-selector"
import { Cart } from "@/components/sales/cart"
import { CheckoutForm, type CheckoutData } from "@/components/sales/checkout-form"
import { getStockItems, createSale, StockItem, SaleItem } from "@/lib/dataProvider"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { getDisplayName } from "next/dist/shared/lib/utils"
import { getStockItemDisplay } from "@/lib/data-store"

export default function NewSalePage() {
  const router = useRouter()
  const [stockItems, setStockItems] = useState<StockItem[]>([])
  const [cartItems, setCartItems] = useState<(SaleItem & { id: string })[]>([])
  const [showCheckout, setShowCheckout] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [loading, setLoading] = useState(true)

  const fetchItems = async () => {
    try {
      const items = await getStockItems()
      setStockItems(items)
    } catch (err) {
      console.error("Failed to fetch stock items:", err)
    } finally {
      setLoading(false)
    }
  }
  // Fetch real stock items from backend
  useEffect(() => {
    fetchItems()
  }, [])

  const handleAddToCart = (item: StockItem, quantity: number) => {
  const itemId = item._id;

  // Find if item already exists in cart
  const existing = cartItems.find(
    (c) => getItemId(c.item) === itemId
  );

  if (existing) {
    // Update existing item
    setCartItems(
      cartItems.map((c) => {
        if (getItemId(c.item) === itemId) {
          const newQuantity = c.quantity + quantity;
          return {
            ...c,
            quantity: newQuantity,
            subtotal: newQuantity * c.unitPrice,
          };
        }
        return c;
      })
    );
  } else {
    // Add new item
    const cartItem: SaleItem & { id: string } = {
      id: `cart-${Date.now()}`,
      item: item,
      name: getStockItemDisplay(item),
      unitPrice: item.pricePerDozen,
      quantity: quantity,
      subtotal: quantity * item.pricePerDozen,
    };
    setCartItems([...cartItems, cartItem]);
  }
};

function getItemId(i: string | StockItem) {
  return typeof i === "string" ? i : i._id;
}


  const handleRemoveItem = (id: string) => {
    setCartItems(cartItems.filter((item) => item.id !== id))
  }

  const handleClearCart = () => {
    if (confirm("Are you sure you want to clear the cart?")) {
      setCartItems([])
    }
  }

  const subtotal = cartItems.reduce((sum, item) => sum + item.subtotal, 0)

  const handleCheckout = async (data: CheckoutData) => {
    try {
      
      const saleData = {
        items: cartItems.map((c) => ({
          item: c.item,
          quantity: c.quantity,
          unitPrice: c.unitPrice,
          subtotal: c.subtotal,
        })),
        total: subtotal,
        paidAmount: data.amountPaid,
        discount: data.discount || 0,
        tax: data.tax || 0,
        paymentMethod: data.paymentMethod,
        status: "completed" as "completed",
        customer: data.customerId
      }

      await createSale(saleData)
      setShowSuccess(true)
      setShowCheckout(false)
      setCartItems([])

      setTimeout(() => {
        setShowSuccess(false)
      }, 10000)
      fetchItems();
    } catch (err) {
      console.error("Failed to complete sale:", err)
      alert("Failed to complete sale. Please try again.")
    }
  }

  if (loading) return <p className="p-4">Loading stock items...</p>

  const availableItems = stockItems.filter((item) => item.quantityInDozen > 0)

  return (
    <div className="container mx-auto p-4 sm:p-6">
      <div className="flex items-center gap-4 mb-4 sm:mb-6">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Back to Dashboard</span>
            <span className="sm:hidden">Back</span>
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">New Sale</h1>
          <p className="hidden sm:block text-muted-foreground">Select items and complete the transaction</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-4 sm:gap-6">
        <div className="lg:col-span-2">
          <ItemSelector items={availableItems} onAddToCart={handleAddToCart} />
        </div>
        <div className="space-y-4">
          <Cart items={cartItems} onRemoveItem={handleRemoveItem} onClearCart={handleClearCart} />
          {cartItems.length > 0 && (
            <Button onClick={() => setShowCheckout(true)} className="w-full" size="lg">
              Proceed to Checkout
            </Button>
          )}
        </div>
      </div>

      <Dialog open={showCheckout} onOpenChange={setShowCheckout}>
        <DialogContent className="w-[calc(100%-2rem)] sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <CheckoutForm subtotal={subtotal} onComplete={handleCheckout} />
        </DialogContent>
      </Dialog>

      <Dialog open={showSuccess} onOpenChange={setShowSuccess}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-center text-2xl">Sale Completed!</DialogTitle>
          </DialogHeader>
          <div className="text-center py-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
