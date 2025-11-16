import mongoose from "mongoose";

const customerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phoneNumber: String,
  shopName: String,
  picture: String,
  totalPurchases: { type: Number, default: 0 },
  pendingPayment: { type: Number, default: 0 }
}, { timestamps: true });

export default mongoose.model("Customer", customerSchema);
