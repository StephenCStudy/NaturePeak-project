import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  propertyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Property",
    required: true,
  },
  senderName: { type: String, required: true },
  senderPhone: { type: String, required: true },
  senderEmail: { type: String },
  message: { type: String, required: true },
  recipientUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  }, // chủ property
  isRead: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Message", messageSchema);
