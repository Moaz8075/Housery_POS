import mongoose from "mongoose"

const customerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    phoneNumber: String,
    shopName: String,
    totalPurchases: Number,
    pendingPayment: Number,
  },
  { timestamps: true }
)

export default mongoose.model("Customer", customerSchema)
