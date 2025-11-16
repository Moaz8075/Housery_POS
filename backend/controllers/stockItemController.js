import StockItem from "../models/StockItem.js";
import asyncHandler from "../middleware/asyncHandler.js";

export const getStockItems = asyncHandler(async (req, res) => {
  const items = await StockItem.find()
    .populate("categoryId", "name")
    .populate("brandId", "name")
    .populate("typeId", "name")
    .populate("sizeId", "name")
    .sort({ createdAt: -1 });

  res.json(items);
});

export const createStockItem = asyncHandler(async (req, res) => {
  const payload = req.body;
  const item = await StockItem.create(payload);
  const populated = await item.populate([
    { path: "categoryId", select: "name" },
    { path: "brandId", select: "name" },
    { path: "typeId", select: "name" },
    { path: "sizeId", select: "name" }
  ]);
  res.status(201).json(populated);
});

export const updateStockItem = asyncHandler(async (req, res) => {
  const updated = await StockItem.findByIdAndUpdate(req.params.id, req.body, { new: true });
  const populated = await updated.populate([
    { path: "categoryId", select: "name" },
    { path: "brandId", select: "name" },
    { path: "typeId", select: "name" },
    { path: "sizeId", select: "name" }
  ]);
  res.json(populated);
});

export const deleteStockItem = asyncHandler(async (req, res) => {
  await StockItem.findByIdAndDelete(req.params.id);
  res.status(204).end();
});
