import mongoose from "mongoose";

const propertySchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  price: { type: Number },
  location: { type: String },
  images: [{ type: String }],
  bedrooms: { type: Number },
  bathrooms: { type: Number },
  area: { type: Number },
  agent: { type: mongoose.Schema.Types.ObjectId, ref: "Agent" },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Property", propertySchema);
