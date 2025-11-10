import mongoose from "mongoose"

const itemTypeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  brandId: { type: mongoose.Schema.Types.ObjectId, ref: "Brand", required: true },
})

export default mongoose.model("ItemType", itemTypeSchema)
