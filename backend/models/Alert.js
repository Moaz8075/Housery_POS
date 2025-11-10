import mongoose from "mongoose"

const alertSchema = new mongoose.Schema(
  {
    type: { type: String, enum: ["low_stock", "payment_due"], required: true },
    title: String,
    message: String,
    severity: { type: String, enum: ["info", "warning", "error"], default: "info" },
    stockItemId: { type: mongoose.Schema.Types.ObjectId, ref: "StockItem" },
    paymentId: { type: mongoose.Schema.Types.ObjectId, ref: "Payment" },
  },
  { timestamps: true }
)

export default mongoose.model("Alert", alertSchema)
