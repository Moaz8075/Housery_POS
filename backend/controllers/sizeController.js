import Size from "../models/Size.js"
import asyncHandler from "../middleware/asyncHandler.js"

// GET all sizes
export const getSizes = asyncHandler(async (req, res) => {
  const sizes = await Size.find()
  res.json(sizes)
})

// POST new size
export const createSize = asyncHandler(async (req, res) => {
  const { name, description } = req.body
  const size = await Size.create({ name, description })
  res.status(201).json(size)
})

// PUT update size
export const updateSize = asyncHandler(async (req, res) => {
  const size = await Size.findByIdAndUpdate(req.params.id, req.body, { new: true })
  res.json(size)
})

// DELETE size
export const deleteSize = asyncHandler(async (req, res) => {
  await Size.findByIdAndDelete(req.params.id)
  res.json({ message: "Size deleted" })
})
