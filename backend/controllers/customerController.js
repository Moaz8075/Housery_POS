import Customer from "../models/Customer.js";
import asyncHandler from "../middleware/asyncHandler.js";

export const getCustomers = asyncHandler(async (req, res) => {
  const items = await Customer.find().sort({ createdAt: -1 });
  res.json(items);
});

export const createCustomer = asyncHandler(async (req, res) => {
  const c = await Customer.create(req.body);
  res.status(201).json(c);
});

export const updateCustomer = asyncHandler(async (req, res) => {
  const updated = await Customer.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updated);
});

export const deleteCustomer = asyncHandler(async (req, res) => {
  await Customer.findByIdAndDelete(req.params.id);
  res.status(204).end();
});
