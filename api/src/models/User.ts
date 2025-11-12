// Khai báo schema (cấu trúc) của dữ liệu trong MongoDB:

import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["admin", "user"], default: "user" },
    avatarUrl: {
      type: String,
      default:
        "https://res.cloudinary.com/dlkwv0qaq/image/upload/v1761876296/default-avatar-profile_bse2jk.webp",
    },
    isBanned: { type: Boolean, default: false },
    rememberToken: { type: String, required: false },
    rememberTokenExpires: { type: Date, required: false },
  },
  {
    timestamps: true, // Tự động thêm createdAt và updatedAt
  }
);

export default mongoose.model("User", userSchema);
