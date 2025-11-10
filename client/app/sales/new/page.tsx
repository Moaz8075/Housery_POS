"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ItemSelector } from "@/components/sales/item-selector"
import { Cart } from "@/components/sales/cart"
import { CheckoutForm, type CheckoutData } from "@/components/sales/checkout-form"
import { stockItems } from "@/lib/data-store"
import type { StockItem, SaleItem } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"

export default function NewSalePage() {
  const router = useRouter()
  const [cartItems, setCartItems] = useState<(SaleItem & { id: string })[]>([])
  const [showCheckout, setShowCheckout] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  const handleAddToCart = (item: StockItem, quantity: number) => {
    const cartItem: SaleItem & { id: string } = {
      id: `cart-${Date.now()}`,
      stockItemId: item.id,
      quantityInDozen: quantity,
      pricePerDozen: item.pricePerDozen,
      pricePerPiece: item.pricePerPiece,
      totalAmount: quantity * item.pricePerDozen,
    }

    setCartItems([...cartItems, cartItem])
  }

  const handleRemoveItem = (id: string) => {
    setCartItems(cartItems.filter((item) => item.id !== id))
  }

  const handleClearCart = () => {
    if (confirm("Are you sure you want to clear the cart?")) {
      setCartItems([])
    }
  }

  const subtotal = cartItems.reduce((sum, item) => sum + item.totalAmount, 0)

  const handleCheckout = (data: CheckoutData) => {
    console.log("[v0] Sale completed:", {
      items: cartItems,
      ...data,
      total: subtotal,
      pending: subtotal - data.amountPaid,
    })

    // Show success message
    setShowSuccess(true)
    setShowCheckout(false)

    // Reset after 2 seconds
    setTimeout(() => {
      setShowSuccess(false)
      setCartItems([])
    }, 2000)
  }

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
        {/* Item Selection - 2 columns on large screens */}
        <div className="lg:col-span-2">
          <ItemSelector items={availableItems} onAddToCart={handleAddToCart} />
        </div>

        {/* Cart - Full width on mobile, 1 column on large */}
        <div className="space-y-4">
          <Cart items={cartItems} onRemoveItem={handleRemoveItem} onClearCart={handleClearCart} />

          {cartItems.length > 0 && (
            <Button onClick={() => setShowCheckout(true)} className="w-full" size="lg">
              Proceed to Checkout
            </Button>
          )}
        </div>
      </div>

      {/* Checkout Dialog */}
      <Dialog open={showCheckout} onOpenChange={setShowCheckout}>
        <DialogContent className="w-[calc(100%-2rem)] sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <CheckoutForm subtotal={subtotal} onComplete={handleCheckout} />
        </DialogContent>
      </Dialog>

      {/* Success Dialog */}
      <Dialog open={showSuccess} onOpenChange={setShowSuccess}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-center text-2xl">Sale Completed!</DialogTitle>
            <DialogDescription className="text-center text-lg pt-4">
              Transaction successful. Receipt generated.
            </DialogDescription>
          </DialogHeader>
          <div className="text-center py-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="text-3xl font-bold">Rs. {subtotal.toLocaleString()}</p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
