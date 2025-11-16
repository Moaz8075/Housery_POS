import Sale from "../models/Sale.js";
import StockItem from "../models/StockItem.js";
import Transaction from "../models/Transaction.js";
import asyncHandler from "../middleware/asyncHandler.js";
import Supplier from "../models/Supplier.js";

export const getDashboard = asyncHandler(async (req, res) => {
  const startOfToday = new Date();
  startOfToday.setHours(0,0,0,0);

  const startOfMonth = new Date(startOfToday.getFullYear(), startOfToday.getMonth(), 1);

  const totalSalesToday = await Sale.aggregate([
    { $match: { createdAt: { $gte: startOfToday } } },
    { $group: { _id: null, total: { $sum: "$total" } } }
  ]);
  const totalSalesThisMonth = await Sale.aggregate([
    { $match: { createdAt: { $gte: startOfMonth } } },
    { $group: { _id: null, total: { $sum: "$total" } } }
  ]);

  const lowStockItemsCount = await StockItem.countDocuments({ $expr: { $lte: ["$quantityInDozen", "$lowStockThreshold"] } });

  const pendingReceivables = await Transaction.aggregate([
    { $match: { type: "sale", amountPending: { $gt: 0 } } },
    { $group: { _id: null, total: { $sum: "$amountPending" } } }
  ]);

  const suppliers = await Supplier.find({}, "totalPurchases paidPayment");

  const pendingPayables = suppliers.reduce((acc, s) => {
    const pending = (s.totalPurchases || 0) - (s.paidPayment || 0);
    return acc + Math.max(pending, 0);
  }, 0);

  const overduePaymentsCount = await Transaction.countDocuments({ type: "sale", amountPending: { $gt: 0 }, dueDate: { $lte: new Date() } });
  const upcomingPaymentsCount = await Transaction.countDocuments({ type: "purchase", dueDate: { $gte: new Date() } });

  res.json({
    totalSalesToday: (totalSalesToday[0] && totalSalesToday[0].total) || 0,
    totalSalesThisMonth: (totalSalesThisMonth[0] && totalSalesThisMonth[0].total) || 0,
    lowStockItemsCount,
    overduePaymentsCount,
    upcomingPaymentsCount,
    pendingReceivables: (pendingReceivables[0] && pendingReceivables[0].total) || 0,
    pendingPayables
  });
});
