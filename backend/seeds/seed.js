require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("../config/db");

const StockItem = require("../models/StockItem");
const Customer = require("../models/Customer");
const Supplier = require("../models/Supplier");
const Sale = require("../models/Sale");
const Payment = require("../models/Payment");

const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/housery_pos";

const run = async () => {
  try {
    await connectDB(uri);

    console.log("✅ Connected to MongoDB");

    // ---------- Stock Items ----------
    // const stockItems = await StockItem.insertMany([
    //   {
    //     categoryId: "cat-1",
    //     brandId: "brand-1",
    //     typeId: "type-1",
    //     sizeId: "size-1",
    //     quantityInDozen: 25,
    //     pricePerDozen: 1200,
    //     pricePerPiece: 100,
    //     lowStockThreshold: 10,
    //   },
    //   {
    //     categoryId: "cat-1",
    //     brandId: "brand-2",
    //     typeId: "type-3",
    //     sizeId: "size-2",
    //     quantityInDozen: 5,
    //     pricePerDozen: 1500,
    //     pricePerPiece: 125,
    //     lowStockThreshold: 10,
    //   },
    // ]);

    // ---------- Customers ----------
    // const customers = await Customer.insertMany([
    //   {
    //     name: "Ali Khan",
    //     phoneNumber: "+92 300 0000001",
    //     shopName: "Khan Garments",
    //     totalPurchases: 45000,
    //     pendingPayment: 12000,
    //   },
    //   {
    //     name: "Bilal Ahmed",
    //     phoneNumber: "+92 300 0000002",
    //     shopName: "Ahmed Traders",
    //     totalPurchases: 38000,
    //     pendingPayment: 0,
    //   },
    // ]);

    // ---------- Suppliers ----------
    // const suppliers = await Supplier.insertMany([
    //   {
    //     name: "Thread Masters",
    //     phoneNumber: "+92 321 1111111",
    //     shopName: "Thread Masters Pvt",
    //     totalPurchases: 85000,
    //     pendingPayment: 15000,
    //   },
    // ]);

    // ---------- Sale ----------
    // const sale = await Sale.create({
    //   invoiceNo: "INV-1001",
    //   items: [
    //     {
    //       item: stockItems[0]._id,
    //       sku: "STOCK-1",
    //       name: "Gull Sando (18/22)",
    //       unitPrice: stockItems[0].pricePerDozen,
    //       quantity: 10,
    //       discount: 0,
    //       subtotal: 12000,
    //     },
    //   ],
    //   total: 12000,
    //   tax: 0,
    //   discount: 0,
    //   paidAmount: 5000,
    //   paymentMethod: "cash",
    //   status: "completed",
    //   createdBy: "Seeder Script",
    // });

    // ---------- Update Stock ----------
    // stockItems[0].quantityInDozen -= 10;
    // await stockItems[0].save();

    // ---------- Payment ----------
    // await Payment.create({
    //   sale: sale._id,
    //   amount: 5000,
    //   method: "cash",
    //   reference: sale.invoiceNo,
    //   receivedBy: "Seeder Script",
    // });

    console.log("🌱 Seed data successfully inserted");
    process.exit(0);
  } catch (err) {
    console.error("❌ Seed error:", err);
    process.exit(1);
  }
};

run();
