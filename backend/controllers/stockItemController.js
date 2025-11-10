import StockItem from "../models/StockItem.js"
import asyncHandler from "../middleware/asyncHandler.js"

// GET all stockItems
export const getStockItems = asyncHandler(async (req, res) => {
  const stockItems = await StockItem.find()
  res.json(stockItems)
})

// POST new stockItem
export const createStockItem = asyncHandler(async (req, res) => {
  const { name, description } = req.body
  const stockItem = await StockItem.create({ name, description })
  res.status(201).json(stockItem)
})

// PUT update stockItem
export const updateStockItem = asyncHandler(async (req, res) => {
  const stockItem = await StockItem.findByIdAndUpdate(req.params.id, req.body, { new: true })
  res.json(stockItem)
})

// DELETE stockItem
export const deleteStockItem = asyncHandler(async (req, res) => {
  await StockItem.findByIdAndDelete(req.params.id)
  res.json({ message: "StockItem deleted" })
})
