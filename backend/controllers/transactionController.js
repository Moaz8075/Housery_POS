import Transaction from "../models/Transaction.js";
import asyncHandler from "../middleware/asyncHandler.js";

export const getTransactions = asyncHandler(async (req, res) => {
  const items = await Transaction.find().sort({ createdAt: -1 });
  res.json(items);
});

export const getTransactionsByType = asyncHandler(async (req, res) => {
  const { id, type } = req.query;
  if (!id || !type) return res.status(400).json({ message: "id and type required" });

  const filter = { type };
  if (type === "sale" || type === "paymentReceive") filter.customerId = id;
  if (type === "purchase" || type === "paymentPaid") filter.supplierId = id;

  const items = await Transaction.find(filter).sort({ createdAt: -1 });
  res.json(items);
});

export const createTransaction = asyncHandler(async (req, res) => {
  const t = await Transaction.create(req.body);
  res.status(201).json(t);
});

export const updateTransaction = asyncHandler(async (req, res) => {
  const updated = await Transaction.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updated);
});

export const deleteTransaction = asyncHandler(async (req, res) => {
  await Transaction.findByIdAndDelete(req.params.id);
  res.status(204).end();
});
