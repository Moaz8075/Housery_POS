import mongoose from "mongoose";
import Sale from "../models/Sale.js";
import Transaction from "../models/Transaction.js";
import Customer from "../models/Customer.js";
import StockItem from "../models/StockItem.js";
import asyncHandler from "../middleware/asyncHandler.js";

export const getSales = asyncHandler(async (req, res) => {
  const page = Number(req.query.page || 1);
  const limit = Number(req.query.limit || 50);
  const sales = await Sale.find()
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit)
    .populate("customer")
    .populate({
      path: "items.item",
      populate: [
        { path: "categoryId", select: "name" },
        { path: "brandId", select: "name" },
        { path: "typeId", select: "name" },
        { path: "sizeId", select: "name" }
      ]
    });

  const total = await Sale.countDocuments();
  res.json({ sales, total });
});

export const getSale = asyncHandler(async (req, res) => {
  const sale = await Sale.findById(req.params.id)
    .populate("customer")
    .populate({
      path: "items.item",
      populate: [
        { path: "categoryId", select: "name" },
        { path: "brandId", select: "name" },
        { path: "typeId", select: "name" },
        { path: "sizeId", select: "name" }
      ]
    });

  if (!sale) {
    res.status(404);
    throw new Error("Sale not found");
  }
  res.json(sale);
});

export const createSale = asyncHandler(async (req, res) => {
  const {
    customer,
    items,
    total,
    tax = 0,
    discount = 0,
    paidAmount = 0,
    paymentMethod = "cash",
    status = "completed",
    createdBy
  } = req.body;

  if (!items || !items.length) {
    return res.status(400).json({ message: "items are required" });
  }

  try {
    // 1. Create Sale
    const saleDoc = await Sale.create({
      customer,
      items,
      total,
      tax,
      discount,
      paidAmount,
      paymentMethod,
      status,
      createdBy
    });

    // 2. Create Transaction
    await Transaction.create({
      type: "sale",
      customerId: customer || undefined,
      sale: saleDoc._id,
      amount: total,
      amountPaid: paidAmount,
      amountPending: Math.max(total - paidAmount, 0),
      createdBy
    });

    // 3. Update customer totals
    if (customer) {
      await Customer.findByIdAndUpdate(customer, {
        $inc: {
          totalPurchases: total,
          pendingPayment: Math.max(total - paidAmount, 0)
        }
      });
    }

    // 4. Update stock quantities
    for (const it of items) {
      await StockItem.findByIdAndUpdate(it.item, {
        $inc: { quantityInDozen: -Math.abs(it.quantity) }
      });
    }

    // 5. Populate sale before sending response
    const populatedSale = await Sale.findById(saleDoc._id)
      .populate("customer")
      .populate({
        path: "items.item",
        populate: [
          { path: "categoryId", select: "name" },
          { path: "brandId", select: "name" },
          { path: "typeId", select: "name" },
          { path: "sizeId", select: "name" }
        ]
      });

    res.status(201).json(populatedSale);

  } catch (err) {
    console.error("Error creating sale:", err);
    res.status(500).json({ message: "Failed to create sale", error: err.message });
  }
});


export const updateSale = asyncHandler(async (req, res) => {
  const updated = await Sale.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updated);
});

export const deleteSale = asyncHandler(async (req, res) => {
  await Sale.findByIdAndDelete(req.params.id);
  res.status(204).end();
});
