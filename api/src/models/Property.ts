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
  agent: { type: mongoose.Schema.Types.ObjectId, ref: "Agent" }, // ng liên hệ
  model: { type: String, enum: ["flat", "land"], required: true }, //loai. hinh` căn họo hoặc đất nền
  transactionType: { type: String, enum: ["sell", "rent"], required: true }, // bán hoặc cho thuê
  views: { type: Number, default: 0 },
  // optional owner reference (User)
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // ng tạo
  status: { type: String, enum: ["active", "hidden"], default: "active" }, // ẩn hiệu của user
  createdAt: { type: Date, default: Date.now }, // ngày tạo
  // admin duyệt bài?
  waitingStatus: {
    type: String,
    enum: ["waiting", "reviewed", "block"],
    default: "waiting",
  },
  // tiện ích xung quanh
  amenities: [{ type: String }],
  // thông tin liên hệ
  contactName: { type: String },
  contactPhone: { type: String },
  contactEmail: { type: String },
});

export default mongoose.model("Property", propertySchema);
