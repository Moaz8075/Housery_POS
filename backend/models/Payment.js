const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    sale: { type: mongoose.Schema.Types.ObjectId, ref: "Sale" },
    amount: { type: Number, required: true },
    method: {
      type: String,
      enum: ["cash", "card", "mobile", "bank", "credit"],
      default: "cash",
    },
    reference: String,
    receivedBy: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Payment", paymentSchema);
