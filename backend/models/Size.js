import mongoose from "mongoose"

const sizeSchema = new mongoose.Schema({
  name: { type: String, required: true },
})

export default mongoose.model("Size", sizeSchema)
