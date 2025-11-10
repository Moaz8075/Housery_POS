const Sale = require("../models/Sale");
const StockItem = require("../models/StockItem");
const asyncHandler = require("../middleware/asyncHandler");
const mongoose = require("mongoose");

// GET /api/sales
exports.getSales = asyncHandler(async (req, res) => {
  const { page = 1, limit = 50 } = req.query;

  const sales = await Sale.find()
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(Number(limit));

  const total = await Sale.countDocuments();
  res.json({ sales, total });
});

// GET /api/sales/:id
exports.getSale = asyncHandler(async (req, res) => {
  const sale = await Sale.findById(req.params.id).populate("items.item");

  if (!sale) {
    res.status(404);
    throw new Error("Sale not found");
  }

  res.json(sale);
});

// POST /api/sales -> create sale and decrement stock
exports.createSale = asyncHandler(async (req, res) => {
  const { invoiceNo, items, tax = 0, discount = 0, payment, createdBy } = req.body;

  if (!invoiceNo || !items || !items.length) {
    res.status(400);
    throw new Error("Invoice number and items are required");
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    let total = 0;
    const saleItems = [];

    for (const it of items) {
      const dbItem = await StockItem.findById(it.item).session(session);

      if (!dbItem) {
        throw new Error(`StockItem ${it.item} not found`);
      }

      // Ensure sufficient stock
      const stockQty = dbItem.quantityInDozen ?? dbItem.quantity ?? 0;
      if (stockQty < it.quantity) {
        throw new Error(`Insufficient stock for ${dbItem.name || dbItem._id}`);
      }

      const unitPrice =
        it.unitPrice || dbItem.pricePerDozen || dbItem.pricePerPiece || 0;
      const subtotal = unitPrice * it.quantity - (it.discount || 0);
      total += subtotal;

      saleItems.push({
        item: dbItem._id,
        sku: dbItem.sku || "",
        name: dbItem.name || "",
        unitPrice,
        quantity: it.quantity,
        discount: it.discount || 0,
        subtotal,
      });

      // Decrement stock
      if (dbItem.quantityInDozen !== undefined)
        dbItem.quantityInDozen -= it.quantity;
      else dbItem.quantity -= it.quantity;

      await dbItem.save({ session });
    }

    // Apply tax and discount
    total = total + Number(tax) - Number(discount || 0);

    const sale = await Sale.create(
      [
        {
          invoiceNo,
          items: saleItems,
          tax,
          discount,
          total,
          paidAmount: payment?.amount || 0,
          paymentMethod: payment?.method || "cash",
          status: "completed",
          createdBy,
        },
      ],
      { session }
    );

    await session.commitTransaction();
    session.endSession();

    res.status(201).json(sale[0]);
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    throw err;
  }
});

// PUT /api/sales/:id
exports.updateSale = asyncHandler(async (req, res) => {
  const sale = await Sale.findByIdAndUpdate(req.params.id, req.body, { new: true });

  if (!sale) {
    res.status(404);
    throw new Error("Sale not found");
  }

  res.json(sale);
});

// DELETE /api/sales/:id
exports.deleteSale = asyncHandler(async (req, res) => {
  const sale = await Sale.findByIdAndDelete(req.params.id);

  if (!sale) {
    res.status(404);
    throw new Error("Sale not found");
  }

  res.json({ message: "Sale deleted" });
});
