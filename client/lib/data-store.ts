// Mock data store - can be replaced with API calls later
import type {
  Category,
  Brand,
  ItemType,
  Size,
  StockItem,
  Customer,
  Supplier,
  Transaction,
  Payment,
  Alert,
  DashboardStats,
} from "./types"

// Categories
export const categories: Category[] = [
  { id: "cat-1", name: "Vest", description: "All types of vests" },
  { id: "cat-2", name: "Thread", description: "Sewing threads" },
  { id: "cat-3", name: "Packaging", description: "Boxes and paper" },
]

// Brands
export const brands: Brand[] = [
  { id: "brand-1", name: "Gull", categoryId: "cat-1" },
  { id: "brand-2", name: "Seiko", categoryId: "cat-1" },
  { id: "brand-3", name: "Premium", categoryId: "cat-1" },
]

// Item Types
export const itemTypes: ItemType[] = [
  { id: "type-1", name: "Sando", brandId: "brand-1" },
  { id: "type-2", name: "Bazo", brandId: "brand-1" },
  { id: "type-3", name: "Sando", brandId: "brand-2" },
  { id: "type-4", name: "Bazo", brandId: "brand-2" },
]

// Sizes
export const sizes: Size[] = [
  { id: "size-1", name: "18/22" },
  { id: "size-2", name: "18/20" },
  { id: "size-3", name: "12" },
  { id: "size-4", name: "20" },
  { id: "size-5", name: "22" },
]

// Stock Items
export const stockItems: StockItem[] = [
  {
    id: "stock-1",
    categoryId: "cat-1",
    brandId: "brand-1",
    typeId: "type-1",
    sizeId: "size-1",
    quantityInDozen: 25,
    pricePerDozen: 1200,
    pricePerPiece: 100,
    lowStockThreshold: 10,
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-15"),
  },
  {
    id: "stock-2",
    categoryId: "cat-1",
    brandId: "brand-1",
    typeId: "type-1",
    sizeId: "size-2",
    quantityInDozen: 5,
    pricePerDozen: 1200,
    pricePerPiece: 100,
    lowStockThreshold: 10,
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-15"),
  },
  {
    id: "stock-3",
    categoryId: "cat-1",
    brandId: "brand-2",
    typeId: "type-3",
    sizeId: "size-1",
    quantityInDozen: 30,
    pricePerDozen: 1500,
    pricePerPiece: 125,
    lowStockThreshold: 8,
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-15"),
  },
]

// Customers
export const customers: Customer[] = [
  {
    id: "cust-1",
    name: "Ahmed Khan",
    phoneNumber: "+92 300 1234567",
    shopName: "Khan Garments",
    totalPurchases: 45000,
    pendingPayment: 12000,
    createdAt: new Date("2024-01-01"),
  },
  {
    id: "cust-2",
    name: "Bilal Ahmed",
    phoneNumber: "+92 301 9876543",
    shopName: "Ahmed Store",
    totalPurchases: 38000,
    pendingPayment: 0,
    createdAt: new Date("2024-01-05"),
  },
  {
    id: "cust-3",
    name: "Hassan Ali",
    phoneNumber: "+92 302 5555555",
    shopName: "Ali Traders",
    totalPurchases: 62000,
    pendingPayment: 25000,
    createdAt: new Date("2024-01-10"),
  },
]

// Suppliers
export const suppliers: Supplier[] = [
  {
    id: "sup-1",
    name: "Karachi Textiles",
    phoneNumber: "+92 321 1111111",
    shopName: "Karachi Textiles Co.",
    totalPurchases: 150000,
    pendingPayment: 35000,
    createdAt: new Date("2023-12-01"),
  },
  {
    id: "sup-2",
    name: "Thread Masters",
    phoneNumber: "+92 322 2222222",
    shopName: "Thread Masters Pvt",
    totalPurchases: 85000,
    pendingPayment: 15000,
    createdAt: new Date("2023-12-15"),
  },
]

// Transactions
export const transactions: Transaction[] = [
  {
    id: "trans-1",
    type: "sale",
    customerId: "cust-1",
    amount: 15000,
    amountPaid: 3000,
    amountPending: 12000,
    items: [
      {
        stockItemId: "stock-1",
        quantityInDozen: 10,
        pricePerDozen: 1200,
        pricePerPiece: 100,
        totalAmount: 12000,
      },
    ],
    createdAt: new Date("2024-01-20"),
    dueDate: new Date("2024-02-20"),
  },
  {
    id: "trans-2",
    type: "sale",
    customerId: "cust-3",
    amount: 25000,
    amountPaid: 0,
    amountPending: 25000,
    items: [
      {
        stockItemId: "stock-3",
        quantityInDozen: 15,
        pricePerDozen: 1500,
        pricePerPiece: 125,
        totalAmount: 22500,
      },
    ],
    createdAt: new Date("2024-01-18"),
    dueDate: new Date("2024-02-15"),
  },
]

// Payments
export const payments: Payment[] = [
  {
    id: "pay-1",
    transactionId: "trans-1",
    customerId: "cust-1",
    type: "receivable",
    amount: 15000,
    amountPaid: 3000,
    amountPending: 12000,
    dueDate: new Date("2024-02-20"),
    status: "partial",
    createdAt: new Date("2024-01-20"),
  },
  {
    id: "pay-2",
    transactionId: "trans-2",
    customerId: "cust-3",
    type: "receivable",
    amount: 25000,
    amountPaid: 0,
    amountPending: 25000,
    dueDate: new Date("2024-02-15"),
    status: "pending",
    createdAt: new Date("2024-01-18"),
  },
]

// Alerts
export const alerts: Alert[] = [
  {
    id: "alert-1",
    type: "low_stock",
    title: "Low Stock Alert",
    message: "Gull Sando (18/20) - Only 5 dozen remaining",
    severity: "warning",
    stockItemId: "stock-2",
    createdAt: new Date(),
  },
  {
    id: "alert-2",
    type: "payment_due",
    title: "Payment Due Soon",
    message: "Payment from Hassan Ali due in 5 days - Rs. 25,000",
    severity: "info",
    paymentId: "pay-2",
    createdAt: new Date(),
  },
]

// Dashboard Stats
export const dashboardStats: DashboardStats = {
  totalSalesToday: 15000,
  totalSalesThisMonth: 125000,
  lowStockItemsCount: 1,
  overduePaymentsCount: 0,
  upcomingPaymentsCount: 2,
  pendingReceivables: 37000,
  pendingPayables: 50000,
}

// Helper functions to get related data
export function getCategoryName(id: string): string {
  return categories.find((c) => c.id === id)?.name || "Unknown"
}

export function getBrandName(id: string): string {
  return brands.find((b) => b.id === id)?.name || "Unknown"
}

export function getTypeName(id: string): string {
  return itemTypes.find((t) => t.id === id)?.name || "Unknown"
}

export function getSizeName(id: string): string {
  return sizes.find((s) => s.id === id)?.name || "Unknown"
}

export function getStockItemDisplay(item: StockItem): string {
  const category = getCategoryName(item.categoryId)
  const brand = getBrandName(item.brandId)
  const type = getTypeName(item.typeId)
  const size = getSizeName(item.sizeId)
  return `${brand} ${type} (${size})`
}
