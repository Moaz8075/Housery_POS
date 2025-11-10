import mongoose from "mongoose"

const transactionSchema = new mongoose.Schema(
  {
    type: { type: String, enum: ["sale", "purchase"], required: true },
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: "Customer" },
    supplierId: { type: mongoose.Schema.Types.ObjectId, ref: "Supplier" },
    amount: Number,
    amountPaid: Number,
    amountPending: Number,
    items: [
      {
        stockItemId: { type: mongoose.Schema.Types.ObjectId, ref: "StockItem" },
        quantityInDozen: Number,
        pricePerDozen: Number,
        pricePerPiece: Number,
        totalAmount: Number,
      },
    ],
    dueDate: Date,
  },
  { timestamps: true }
)

export default mongoose.model("Transaction", transactionSchema)
