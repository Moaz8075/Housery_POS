import mongoose from "mongoose";

const saleItemSchema = new mongoose.Schema({
  item: { type: mongoose.Schema.Types.ObjectId, ref: "StockItem", required: true },
  sku: String,
  name: String,
  unitPrice: Number,
  quantity: Number, // dozens sold
  discount: { type: Number, default: 0 },
  subtotal: Number
}, { _id: false });

const saleSchema = new mongoose.Schema({
  customer: { type: mongoose.Schema.Types.ObjectId, ref: "Customer" },
  items: [saleItemSchema],
  total: { type: Number, required: true },
  tax: { type: Number, default: 0 },
  discount: { type: Number, default: 0 },
  paidAmount: { type: Number, default: 0 },
  paymentMethod: { type: String, enum: ["cash","card","mobile","credit"], default: "cash" },
  status: { type: String, enum: ["draft","completed","cancelled"], default: "completed" },
  createdBy: String
}, { timestamps: true });

export default mongoose.model("Sale", saleSchema);
