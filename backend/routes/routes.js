import express from "express"

// Category
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../controllers/categoryController.js"

// Brand
import {
  getBrands,
  createBrand,
  updateBrand,
  deleteBrand,
} from "../controllers/brandController.js"

// Item Types
import {
  getItemTypes,
  createItemType,
  updateItemType,
  deleteItemType,
} from "../controllers/itemTypeController.js"

// Sizes
import {
  getSizes,
  createSize,
  updateSize,
  deleteSize,
} from "../controllers/sizeController.js"

// Stock Items
import {
  getStockItems,
  createStockItem,
  updateStockItem,
  deleteStockItem,
} from "../controllers/stockItemController.js"

// Customers
import {
  getCustomers,
  createCustomer,
  updateCustomer,
  deleteCustomer,
} from "../controllers/customerController.js"

// Suppliers
import {
  getSuppliers,
  createSupplier,
  updateSupplier,
  deleteSupplier,
} from "../controllers/supplierController.js"

// Sales
import {
  getSales,
  createSale,
  updateSale,
  deleteSale,
} from "../controllers/saleController.js"

// Transactions
import {
  getTransactions,
  getTransactionsByType,
  createTransaction,
  updateTransaction,
  deleteTransaction,
} from "../controllers/transactionController.js"

// Dashboard
import { getDashboard} from "../controllers/dashboardController.js"

const router = express.Router()

// ---------- Categories ----------
router.route("/categories").get(getCategories).post(createCategory)
router.route("/categories/:id").put(updateCategory).delete(deleteCategory)

// ---------- Brands ----------
router.route("/brands").get(getBrands).post(createBrand)
router.route("/brands/:id").put(updateBrand).delete(deleteBrand)

// ---------- Item Types ----------
router.route("/item-types").get(getItemTypes).post(createItemType)
router.route("/item-types/:id").put(updateItemType).delete(deleteItemType)

// ---------- Sizes ----------
router.route("/sizes").get(getSizes).post(createSize)
router.route("/sizes/:id").put(updateSize).delete(deleteSize)

// ---------- Stock Items ----------
router.route("/stock-items").get(getStockItems).post(createStockItem)
router.route("/stock-items/:id").put(updateStockItem).delete(deleteStockItem)

// ---------- Customers ----------
router.route("/customers").get(getCustomers).post(createCustomer)
router.route("/customers/:id").put(updateCustomer).delete(deleteCustomer)

// ---------- Suppliers ----------
router.route("/suppliers").get(getSuppliers).post(createSupplier)
router.route("/suppliers/:id").put(updateSupplier).delete(deleteSupplier)

// ---------- Sales ----------
router.route("/sales").get(getSales).post(createSale)
router.route("/sales/:id").put(updateSale).delete(deleteSale)

// ---------- Transactions ----------
router.route("/transactions").get(getTransactions).post(createTransaction)
router.route("/transactions/:id").put(updateTransaction).delete(deleteTransaction)
router.get("/transactionsByType", getTransactionsByType)

// ---------- Dashboard ----------
router.get("/dashboard", getDashboard)

export default router
