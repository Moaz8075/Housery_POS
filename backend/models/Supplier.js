import mongoose from "mongoose"

const supplierSchema = new mongoose.Schema(
  {
    name: String,
    phoneNumber: String,
    shopName: String,
    totalPurchases: Number,
    pendingPayment: Number,
  },
  { timestamps: true }
)

export default mongoose.model("Supplier", supplierSchema)
