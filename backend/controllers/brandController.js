import Brand from "../models/Brand.js"
import asyncHandler from "../middleware/asyncHandler.js"

// GET all brands
export const getBrands = asyncHandler(async (req, res) => {
  const brands = await Brand.find()
  res.json(brands)
})

// POST new brand
export const createBrand = asyncHandler(async (req, res) => {
  const { name, description } = req.body
  const brand = await Brand.create({ name, description })
  res.status(201).json(brand)
})

// PUT update brand
export const updateBrand = asyncHandler(async (req, res) => {
  const brand = await Brand.findByIdAndUpdate(req.params.id, req.body, { new: true })
  res.json(brand)
})

// DELETE brand
export const deleteBrand = asyncHandler(async (req, res) => {
  await Brand.findByIdAndDelete(req.params.id)
  res.json({ message: "Brand deleted" })
})
