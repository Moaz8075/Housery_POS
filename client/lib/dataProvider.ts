import { fetchAPI } from "./api-client"

// ---------- TYPES ----------
export interface Category {
  _id: string
  name: string
  description?: string
}

export interface ItemType {
  _id: string
  name: string
}

export interface Brand {
  _id: string
  name: string
  categoryId: string
}

export interface StockItem {
  _id: string
  categoryId: Category
  brandId: Brand
  typeId?: ItemType
  sizeId?: Size
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
  totalPurchases: number
  pendingPayment: number
  createdAt: Date
  picture?: string
}

export interface Supplier {
  _id: string
  name: string
  phoneNumber: string
  shopName?: string
  totalPurchases: number
  paidPayment: number
  createdAt?: string
  picture?: string
}

export interface SaleItem {
  item: string | StockItem // StockItem reference
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
  customer?: string | Customer
  items: SaleItem[]
  total: number
  tax: number
  discount: number
  paidAmount: number
  paymentMethod: "cash" | "card" | "mobile" | "credit"
  status: "draft" | "completed" | "cancelled"
  createdAt?: string
  createdBy?: string
}

export interface Payment {
  _id: string
  sale?: string // optional because a payment might not be tied to a specific sale
  amount: number
  type: "receiving" | "paying"
  method: "cash" | "card" | "mobile" | "bank" | "credit"
  from?: string // references Customer _id
  to?: string   // references Supplier _id
  createdAt: string
  updatedAt: string
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

export interface Size {
  _id: string
  name: string
  description?: string
}

export interface ItemType {
  _id: string
  name: string
  brandId?: string
}

export interface Transaction {
  _id: string
  type: "sale" | "purchase" | "paymentReceive" | "paymentPaid"
  customerId?: string | Customer
  supplierId?: string | Supplier
  amount: number
  amountPaid?: number
  amountPending?: number
  sale?: Sale
  dueDate?: string
  createdAt?: string
  updatedAt?: string
  note?: string
}

// ---------- HELPERS ----------
const get = async <T>(url: string): Promise<T> => fetchAPI<T>(`${url}`)
const post = async <T>(url: string, body: any): Promise<T> =>
  fetchAPI<T>(`${url}`, { method: "POST", body })
const put = async <T>(url: string, body: any): Promise<T> =>
  fetchAPI<T>(`${url}`, { method: "PUT", body })
const del = async <T>(url: string): Promise<T> =>
  fetchAPI<T>(`${url}`, { method: "DELETE" })

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
export const getSuppliers = () => get<{
  suppliers: Supplier[]
  total: number
}>("/suppliers")
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

// ---------- ITEM TYPES ----------
export const getItemTypes = () => get<ItemType[]>("/item-types")
export const createItemType = (data: Partial<ItemType>) => post<ItemType>("/item-types", data)
export const updateItemType = (id: string, data: Partial<ItemType>) =>
  put<ItemType>(`/item-types/${id}`, data)
export const deleteItemType = (id: string) => del(`/item-types/${id}`)

// ---------- SIZES ----------
export const getSizes = () => get<Size[]>("/sizes")
export const createSize = (data: Partial<Size>) => post<Size>("/sizes", data)
export const updateSize = (id: string, data: Partial<Size>) => put<Size>(`/sizes/${id}`, data)
export const deleteSize = (id: string) => del(`/sizes/${id}`)


// ---------- TRANSACTIONS ----------
export const getTransactions = () => get<Transaction[]>("/transactions")
export const getTransactionsByType = (id: string, type: string) =>
  get<Transaction[]>(`/transactionsByType?id=${id}&type=${type}`)
export const createTransaction = (data: Partial<Transaction>) =>
  post<Transaction>("/transactions", data)
export const updateTransaction = (id: string, data: Partial<Transaction>) =>
  put<Transaction>(`/transactions/${id}`, data)
export const deleteTransaction = (id: string) => del(`/transactions/${id}`)

// ---------- DASHBOARD ----------
export const getDashboardStats = async (): Promise<DashboardStats> => {
  return await get<DashboardStats>("/dashboard")
}

export function getStockItemDisplay(item: StockItem | string): string {
  if(typeof(item) === 'string') return ''
  const category = item.categoryId?.name
  const brand = item.brandId?.name
  const type = item.typeId?.name 
  const size = item.sizeId?.name
  return `${category} ${brand} ${type} (${size})`
}
