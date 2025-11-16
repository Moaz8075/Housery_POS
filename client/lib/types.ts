// Core data types for Housery POS System

export interface Category {
  id: string
  name: string
  description?: string
}

export interface Brand {
  id: string
  name: string
  categoryId: string
}

export interface ItemType {
  id: string
  name: string
  brandId: string
}

export interface Size {
  id: string
  name: string // e.g., "18/22", "18/20", "12", "20", "22"
}

export interface StockItem {
  id: string
  categoryId: string
  brandId: string
  typeId: string
  sizeId: string
  quantityInDozen: number
  pricePerDozen: number
  pricePerPiece: number
  lowStockThreshold: number
  createdAt: Date
  updatedAt: Date
}

export interface Customer {
  id: string
  name: string
  phoneNumber: string
  shopName?: string
  picture?: string
  totalPurchases: number
  pendingPayment: number
  createdAt: Date
}

export interface Supplier {
  id: string
  name: string
  phoneNumber: string
  shopName?: string
  picture?: string
  totalPurchases: number
  pendingPayment: number
  createdAt: Date
}

export type TransactionType = "sale" | "payment_received" | "purchase" | "payment_made"

export interface Transaction {
  id: string
  type: TransactionType
  customerId?: string
  supplierId?: string
  amount: number
  amountPaid: number
  amountPending: number
  items?: SaleItem[]
  note?: string
  createdAt: Date
  dueDate?: Date
}

export interface SaleItem {
  stockItemId: string
  quantityInDozen: number
  pricePerDozen: number
  pricePerPiece: number
  totalAmount: number
  name: string
  subtotal: number
}

export interface Payment {
  id: string
  transactionId: string
  customerId?: string
  supplierId?: string
  type: "receivable" | "payable"
  amount: number
  amountPaid: number
  amountPending: number
  dueDate?: Date
  status: "pending" | "partial" | "paid" | "overdue"
  createdAt: Date
}

export interface Alert {
  id: string
  type: "low_stock" | "payment_due" | "payment_overdue"
  title: string
  message: string
  severity: "info" | "warning" | "error"
  stockItemId?: string
  paymentId?: string
  createdAt: Date
}

export interface DashboardStats {
  totalSalesToday: number
  totalSalesThisMonth: number
  lowStockItemsCount: number
  overduePaymentsCount: number
  upcomingPaymentsCount: number
  pendingReceivables: number
  pendingPayables: number
}
