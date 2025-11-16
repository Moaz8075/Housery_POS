import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({
  type: { type: String, enum: ["sale","purchase","paymentReceive","paymentPaid"], required: true },
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: "Customer" },
  supplierId: { type: mongoose.Schema.Types.ObjectId, ref: "Supplier" },
  amount: { type: Number, required: true },
  amountPaid: { type: Number, default: 0 },
  amountPending: { type: Number, default: 0 },
  sale: { type: mongoose.Schema.Types.ObjectId, ref: "Sale" },
  purchase: { type: mongoose.Schema.Types.ObjectId, ref: "Purchase" },
  dueDate: Date,
  note: String
}, { timestamps: true });

transactionSchema.pre("save", function (next) {
  this.amountPending = (this.amount || 0) - (this.amountPaid || 0);
  next();
});

export default mongoose.model("Transaction", transactionSchema);
