import mongoose from "mongoose"

const stockItemSchema = new mongoose.Schema(
  {
    categoryId: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
    brandId: { type: mongoose.Schema.Types.ObjectId, ref: "Brand" },
    typeId: { type: mongoose.Schema.Types.ObjectId, ref: "ItemType" },
    sizeId: { type: mongoose.Schema.Types.ObjectId, ref: "Size" },
    quantityInDozen: Number,
    pricePerDozen: Number,
    pricePerPiece: Number,
    lowStockThreshold: Number,
  },
  { timestamps: true }
)

export default mongoose.model("StockItem", stockItemSchema)
