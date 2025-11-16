import ItemType from "../models/ItemType.js"
import asyncHandler from "../middleware/asyncHandler.js"

// GET all itemTypes
export const getItemTypes = asyncHandler(async (req, res) => {
  const itemTypes = await ItemType.find()
  res.json(itemTypes)
})

// POST new itemType
export const createItemType = asyncHandler(async (req, res) => {
  const { name, description } = req.body
  const itemType = await ItemType.create({ name, description })
  res.status(201).json(itemType)
})

// PUT update itemType
export const updateItemType = asyncHandler(async (req, res) => {
  const itemType = await ItemType.findByIdAndUpdate(req.params.id, req.body, { new: true })
  res.json(itemType)
})

// DELETE transaction
export const deleteItemType = asyncHandler(async (req, res) => {
  await ItemType.findByIdAndDelete(req.params.id)
  res.json({ message: "ItemType deleted" })
})
