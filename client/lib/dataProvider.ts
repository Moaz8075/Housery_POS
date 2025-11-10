import { fetchAPI } from "./api-client"

// ---------- TYPES ----------
export interface Category {
  _id: string
  name: string
  description?: string
}

export interface Brand {
  _id: string
  name: string
  categoryId: string
}

export interface StockItem {
  _id: string
  categoryId: string
  brandId: string
  typeId?: string
  sizeId?: string
  quantityInDozen: number
  pricePerDozen: number
  pricePerPiece: number
  lowStockThreshold: number
  createdAt: string
  updatedAt: string
}

export interface Customer {
  _id: string
  name: string
  phoneNumber: string
  shopName?: string
  totalPurchases?: number
  pendingPayment?: number
  createdAt: string
}

export interface Supplier {
  _id: string
  name: string
  phoneNumber: string
  shopName?: string
  totalPurchases?: number
  pendingPayment?: number
  createdAt: string
}

export interface SaleItem {
  item: string // StockItem reference
  sku?: string
  name?: string
  unitPrice: number
  quantity: number
  discount?: number
  subtotal: number
}

export interface Sale {
  _id: string
  invoiceNo: string
  items: SaleItem[]
  total: number
  tax: number
  discount: number
  paidAmount: number
  paymentMethod: "cash" | "card" | "mobile" | "credit"
  status: "draft" | "completed" | "cancelled"
  createdAt: string
  createdBy?: string
}

export interface Payment {
  _id: string
  sale?: string
  amount: number
  method: "cash" | "card" | "mobile" | "bank" | "credit"
  reference?: string
  receivedBy?: string
  createdAt: string
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

// ---------- HELPERS ----------
const get = async <T>(url: string): Promise<T> => fetchAPI<T>(`${url}`)
const post = async <T>(url: string, body: any): Promise<T> =>
  fetchAPI<T>(`/api${url}`, { method: "POST", body })
const put = async <T>(url: string, body: any): Promise<T> =>
  fetchAPI<T>(`/api${url}`, { method: "PUT", body })
const del = async <T>(url: string): Promise<T> =>
  fetchAPI<T>(`/api${url}`, { method: "DELETE" })

// ---------- CATEGORIES ----------
export const getCategories = () => get<Category[]>("/categories")
export const createCategory = (data: Partial<Category>) => post<Category>("/categories", data)
export const updateCategory = (id: string, data: Partial<Category>) =>
  put<Category>(`/categories/${id}`, data)
export const deleteCategory = (id: string) => del(`/categories/${id}`)

// ---------- BRANDS ----------
export const getBrands = () => get<Brand[]>("/brands")
export const createBrand = (data: Partial<Brand>) => post<Brand>("/brands", data)
export const updateBrand = (id: string, data: Partial<Brand>) => put<Brand>(`/brands/${id}`, data)
export const deleteBrand = (id: string) => del(`/brands/${id}`)

// ---------- STOCK ITEMS ----------
export const getStockItems = () => get<StockItem[]>("/stock-items")
export const createStockItem = (data: Partial<StockItem>) => post<StockItem>("/stock-items", data)
export const updateStockItem = (id: string, data: Partial<StockItem>) =>
  put<StockItem>(`/stock-items/${id}`, data)
export const deleteStockItem = (id: string) => del(`/stock-items/${id}`)

// ---------- CUSTOMERS ----------
export const getCustomers = () => get<Customer[]>("/customers")
export const createCustomer = (data: Partial<Customer>) => post<Customer>("/customers", data)
export const updateCustomer = (id: string, data: Partial<Customer>) =>
  put<Customer>(`/customers/${id}`, data)
export const deleteCustomer = (id: string) => del(`/customers/${id}`)

// ---------- SUPPLIERS ----------
export const getSuppliers = () => get<Supplier[]>("/suppliers")
export const createSupplier = (data: Partial<Supplier>) => post<Supplier>("/suppliers", data)
export const updateSupplier = (id: string, data: Partial<Supplier>) =>
  put<Supplier>(`/suppliers/${id}`, data)
export const deleteSupplier = (id: string) => del(`/suppliers/${id}`)

// ---------- SALES ----------
export const getSales = async (): Promise<{ sales: Sale[]; total: number }> =>
  get<{ sales: Sale[]; total: number }>("/sales")
export const createSale = (data: Partial<Sale>) => post<Sale>("/sales", data)
export const updateSale = (id: string, data: Partial<Sale>) => put<Sale>(`/sales/${id}`, data)
export const deleteSale = (id: string) => del(`/sales/${id}`)

// ---------- PAYMENTS ----------
export const getPayments = async (): Promise<{ payments: Payment[] }> =>
  get<{ payments: Payment[] }>("/payments")
export const createPayment = (data: Partial<Payment>) => post<Payment>("/payments", data)
export const updatePayment = (id: string, data: Partial<Payment>) =>
  put<Payment>(`/payments/${id}`, data)
export const deletePayment = (id: string) => del(`/payments/${id}`)

// ---------- DASHBOARD ----------
export const getDashboardStats = async (): Promise<DashboardStats> => {
  return await get<DashboardStats>("/dashboard")
}
