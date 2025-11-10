import Transaction from "../models/Transaction.js"
import asyncHandler from "../middleware/asyncHandler.js"

// GET all transactions
export const getTransactions = asyncHandler(async (req, res) => {
  const transactions = await Transaction.find()
  res.json(transactions)
})

// POST new transaction
export const createTransaction = asyncHandler(async (req, res) => {
  const { name, description } = req.body
  const transaction = await Transaction.create({ name, description })
  res.status(201).json(transaction)
})

// PUT update transaction
export const updateTransaction = asyncHandler(async (req, res) => {
  const transaction = await Transaction.findByIdAndUpdate(req.params.id, req.body, { new: true })
  res.json(transaction)
})

// DELETE transaction
export const deleteTransaction = asyncHandler(async (req, res) => {
  await Transaction.findByIdAndDelete(req.params.id)
  res.json({ message: "Transaction deleted" })
})
