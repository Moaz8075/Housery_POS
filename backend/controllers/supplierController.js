import Supplier from "../models/Supplier.js";
import asyncHandler from "../middleware/asyncHandler.js";

export const getSuppliers = asyncHandler(async (req, res) => {
  const items = await Supplier.find().sort({ createdAt: -1 });
  const total = await Supplier.countDocuments();
  res.json({ suppliers: items, total });
});

export const createSupplier = asyncHandler(async (req, res) => {
  const s = await Supplier.create(req.body);
  res.status(201).json(s);
});

export const updateSupplier = asyncHandler(async (req, res) => {
  const updated = await Supplier.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updated);
});

export const deleteSupplier = asyncHandler(async (req, res) => {
  await Supplier.findByIdAndDelete(req.params.id);
  res.status(204).end();
});
