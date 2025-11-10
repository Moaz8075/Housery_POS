import express from "express"
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../controllers/categoryController.js"
import {
  getBrands,
  createBrand,
  updateBrand,
  deleteBrand,
} from "../controllers/brandController.js"
import {
  getStockItems,
  createStockItem,
  updateStockItem,
  deleteStockItem,
} from "../controllers/stockItemController.js"
import { getDashboardStats } from "../controllers/dashboardController.js"
import { createPayment, getPayments, deletePayment } from "../controllers/paymentController.js"
import { createSale, deleteSale, getSales, updateSale } from "../controllers/saleController.js"

const router = express.Router()

// Categories
router.route("/categories").get(getCategories).post(createCategory)
router.route("/categories/:id").put(updateCategory).delete(deleteCategory)

// Payments
router.route("/payments").get(getPayments).post(createPayment)
router.route("/payments/:id").delete(deletePayment)

// Sales
router.route("/sales").get(getSales).post(createSale)
router.route("/sales/:id").put(updateSale).delete(deleteSale)

// Brands
router.route("/brands").get(getBrands).post(createBrand)
router.route("/brands/:id").put(updateBrand).delete(deleteBrand)

// Stock Items
router.route("/stock-items").get(getStockItems).post(createStockItem)
router.route("/stock-items/:id").put(updateStockItem).delete(deleteStockItem)

// --- Dashboard Stats ---
router.get("/dashboard", getDashboardStats)

export default router
