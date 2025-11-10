const mongoose = require('mongoose');

const saleItemSchema = new mongoose.Schema({
  item: { type: mongoose.Schema.Types.ObjectId, ref: 'Item', required: true },
  sku: String,
  name: String,
  unitPrice: Number,
  quantity: Number,
  discount: { type: Number, default: 0 }, // absolute
  subtotal: Number
}, { _id: false });

const saleSchema = new mongoose.Schema({
  invoiceNo: { type: String, required: true, unique: true },
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer' },
  items: [saleItemSchema],
  total: { type: Number, required: true },
  tax: { type: Number, default: 0 },
  discount: { type: Number, default: 0 },
  paidAmount: { type: Number, default: 0 },
  paymentMethod: { type: String, enum: ['cash','card','mobile','credit'], default: 'cash' },
  status: { type: String, enum: ['draft','completed','cancelled'], default: 'completed' },
  createdAt: { type: Date, default: Date.now },
  createdBy: String // username or userId
});

module.exports = mongoose.model('Sale', saleSchema);
