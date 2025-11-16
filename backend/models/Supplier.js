import mongoose from "mongoose";

const supplierSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phoneNumber: String,
  shopName: String,
  picture: String,
  totalPurchases: { type: Number, default: 0 },
  paidPayment: { type: Number, default: 0 }
}, { timestamps: true });

export default mongoose.model("Supplier", supplierSchema);
