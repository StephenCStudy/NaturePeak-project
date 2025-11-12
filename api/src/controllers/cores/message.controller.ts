import Message from "../../models/Message.js";
import Property from "../../models/Property.js";
import User from "../../models/User.js";
import { Request, Response } from "express";
import type { AuthRequest } from "../../middlewares/auth.middleware.js";

export const MessageController = {
  // Gửi tin nhắn (bắt buộc đăng nhập)
  sendMessage: async (req: AuthRequest, res: Response) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res
          .status(401)
          .json({ message: "Vui lòng đăng nhập để gửi tin nhắn" });
      }

      const { propertyId, message } = req.body;

      // Validate required fields
      if (!propertyId || !message) {
        return res.status(400).json({ message: "Thiếu thông tin bắt buộc" });
      }

      // Tìm property để lấy userId (chủ property)
      const property = await Property.findById(propertyId);
      if (!property) {
        return res.status(404).json({ message: "Không tìm thấy bất động sản" });
      }

      if (!property.userId) {
        return res
          .status(400)
          .json({ message: "Bất động sản không có chủ sở hữu" });
      }

      // Không cho phép gửi tin nhắn cho chính mình
      if (property.userId.toString() === userId) {
        return res
          .status(400)
          .json({ message: "Không thể gửi tin nhắn cho chính mình" });
      }

      // Lấy thông tin user đang đăng nhập
      const sender = await User.findById(userId);
      if (!sender) {
        return res.status(404).json({ message: "Không tìm thấy người dùng" });
      }

      // Tạo message mới với thông tin từ user đang đăng nhập
      const newMessage = await Message.create({
        propertyId,
        senderName: sender.name,
        senderPhone: sender.phone,
        senderEmail: sender.email,
        message,
        recipientUserId: property.userId,
      });

      const populatedMessage = await Message.findById(newMessage._id)
        .populate("propertyId", "title images location")
        .populate("recipientUserId", "name email");

      res.status(201).json({
        message: "Gửi tin nhắn thành công",
        data: populatedMessage,
      });
    } catch (err) {
      console.error("Send message error:", err);
      res.status(500).json({ message: (err as any).message });
    }
  },

  // Lấy danh sách tin nhắn của user (cần đăng nhập)
  getMyMessages: async (req: AuthRequest, res: Response) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const { page = "1", limit = "3" } = req.query as {
        page?: string;
        limit?: string;
      };

      const pageNum = parseInt(page, 10);
      const limitNum = parseInt(limit, 10);
      const skip = (pageNum - 1) * limitNum;

      // Đếm tổng số tin nhắn
      const total = await Message.countDocuments({ recipientUserId: userId });

      // Lấy tin nhắn với phân trang
      const messages = await Message.find({ recipientUserId: userId })
        .populate("propertyId", "title images location price")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum);

      res.json({
        messages,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          totalPages: Math.ceil(total / limitNum),
        },
      });
    } catch (err) {
      console.error("Get messages error:", err);
      res.status(500).json({ message: (err as any).message });
    }
  },

  // Đánh dấu tin nhắn đã đọc
  markAsRead: async (req: AuthRequest, res: Response) => {
    try {
      const userId = req.user?.id;
      const { id } = req.params;

      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const message = await Message.findById(id);
      if (!message) {
        return res.status(404).json({ message: "Không tìm thấy tin nhắn" });
      }

      // Check ownership
      if (message.recipientUserId.toString() !== userId) {
        return res.status(403).json({ message: "Forbidden" });
      }

      message.isRead = true;
      await message.save();

      res.json({ message: "Đã đánh dấu đọc", data: message });
    } catch (err) {
      res.status(500).json({ message: (err as any).message });
    }
  },

  // Xóa tin nhắn
  deleteMessage: async (req: AuthRequest, res: Response) => {
    try {
      const userId = req.user?.id;
      const { id } = req.params;

      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const message = await Message.findById(id);
      if (!message) {
        return res.status(404).json({ message: "Không tìm thấy tin nhắn" });
      }

      // Check ownership
      if (message.recipientUserId.toString() !== userId) {
        return res.status(403).json({ message: "Forbidden" });
      }

      await message.deleteOne();
      res.json({ message: "Đã xóa tin nhắn" });
    } catch (err) {
      res.status(500).json({ message: (err as any).message });
    }
  },
};
