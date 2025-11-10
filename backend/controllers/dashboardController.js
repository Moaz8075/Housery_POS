import StockItem from "../models/StockItem.js"
import Payment from "../models/Payment.js"
import Transaction from "../models/Transaction.js"

export const getDashboardStats = async (req, res) => {
  try {
    // --- Low Stock ---
    const lowStockItems = await StockItem.countDocuments({
      $expr: { $lt: ["$quantityInDozen", "$lowStockThreshold"] },
    })

    // --- Payments ---
    const payments = await Payment.find()
    const overduePayments = payments.filter(
      (p) => new Date(p.dueDate) < new Date() && p.status !== "paid"
    )
    const upcomingPayments = payments.filter(
      (p) =>
        new Date(p.dueDate) >= new Date() &&
        (p.status === "pending" || p.status === "partial")
    )

    const pendingReceivables = payments
      .filter((p) => p.type === "receivable")
      .reduce((acc, p) => acc + (p.amountPending || 0), 0)

    const pendingPayables = payments
      .filter((p) => p.type === "payable")
      .reduce((acc, p) => acc + (p.amountPending || 0), 0)

    // --- Sales (Transactions) ---
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const sales = await Transaction.find({ type: "sale" })

    const totalSalesToday = sales
      .filter((s) => new Date(s.createdAt) >= today)
      .reduce((acc, s) => acc + (s.amount || 0), 0)

    const currentMonth = today.getMonth()
    const totalSalesThisMonth = sales
      .filter(
        (s) =>
          new Date(s.createdAt).getMonth() === currentMonth &&
          new Date(s.createdAt).getFullYear() === today.getFullYear()
      )
      .reduce((acc, s) => acc + (s.amount || 0), 0)

    // --- Response ---
    res.json({
      totalSalesToday,
      totalSalesThisMonth,
      lowStockItemsCount: lowStockItems,
      overduePaymentsCount: overduePayments.length,
      upcomingPaymentsCount: upcomingPayments.length,
      pendingReceivables,
      pendingPayables,
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: "Error fetching dashboard stats" })
  }
}
