import Category from "../models/Category.js"
import asyncHandler from "../middleware/asyncHandler.js"

// GET all categories
export const getCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find()
  res.json(categories)
})

// POST new category
export const createCategory = asyncHandler(async (req, res) => {
  const { name, description } = req.body
  const category = await Category.create({ name, description })
  res.status(201).json(category)
})

// PUT update category
export const updateCategory = asyncHandler(async (req, res) => {
  const category = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true })
  res.json(category)
})

// DELETE category
export const deleteCategory = asyncHandler(async (req, res) => {
  await Category.findByIdAndDelete(req.params.id)
  res.json({ message: "Category deleted" })
})
