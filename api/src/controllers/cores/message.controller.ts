import Message from "../../models/Message.js";
import Property from "../../models/Property.js";
import User from "../../models/User.js";
import Agent from "../../models/Agent.js";
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

      const { propertyId, message, recipient } = req.body;

      // Validate required fields
      if (!propertyId || !message) {
        return res.status(400).json({ message: "Thiếu thông tin bắt buộc" });
      }

      // Tìm property để lấy thông tin cơ bản
      const property = await Property.findById(propertyId);
      if (!property) {
        return res.status(404).json({ message: "Không tìm thấy bất động sản" });
      }

      // Lấy thông tin user đang đăng nhập
      const sender = await User.findById(userId);
      if (!sender) {
        return res.status(404).json({ message: "Không tìm thấy người dùng" });
      }

      // Xác định recipient từ request hoặc property
      let recipientUserId = property.userId;
      let recipientName = "";
      let recipientPhone = "";
      let recipientEmail = "";

      if (recipient) {
        // Nếu có recipient info từ frontend, sử dụng nó
        recipientName = recipient.name;
        recipientPhone = recipient.phone || "";
        recipientEmail = recipient.email || "";

        // Nếu là agent hoặc user, lấy userId
        if (recipient.type === "agent" || recipient.type === "user") {
          if (recipient.id) {
            recipientUserId = recipient.id;
          }
        } else {
          // Nếu là contact (không có userId), dùng property.userId làm recipient
          recipientUserId = property.userId;
        }
      } else {
        // Fallback: dùng property.userId
        if (!property.userId) {
          return res
            .status(400)
            .json({ message: "Bất động sản không có chủ sở hữu" });
        }
      }

      // Kiểm tra không cho phép gửi tin nhắn cho chính mình (sau khi xác định recipient)
      if (recipientUserId && recipientUserId.toString() === userId) {
        return res
          .status(400)
          .json({ message: "Không thể gửi tin nhắn cho chính mình" });
      }

      // Tạo message mới với thông tin từ user đang đăng nhập
      const newMessage = await Message.create({
        propertyId,
        senderName: sender.name,
        senderPhone: sender.phone,
        senderEmail: sender.email,
        message,
        recipientUserId,
        recipientName: recipientName || undefined,
        recipientPhone: recipientPhone || undefined,
        recipientEmail: recipientEmail || undefined,
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

  // Xóa tin nhắn cho agent (không cần auth token)
  deleteMessageByAgent: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { agentEmail } = req.body;

      if (!agentEmail) {
        return res.status(400).json({ message: "Thiếu agentEmail" });
      }

      // Tìm agent
      const agent = await Agent.findOne({ email: agentEmail });
      if (!agent) {
        return res.status(404).json({ message: "Không tìm thấy agent" });
      }

      const message = await Message.findById(id);
      if (!message) {
        return res.status(404).json({ message: "Không tìm thấy tin nhắn" });
      }

      // Kiểm tra agent có quyền xóa (phải là người nhận)
      if (message.recipientUserId.toString() !== agent._id.toString()) {
        return res
          .status(403)
          .json({ message: "Không có quyền xóa tin nhắn này" });
      }

      await message.deleteOne();
      res.json({ message: "Đã xóa tin nhắn" });
    } catch (err) {
      res.status(500).json({ message: (err as any).message });
    }
  },

  // Đại lý gửi tin nhắn tới người dùng (không yêu cầu auth, xác thực qua email đại lý)
  sendMessageFromAgent: async (req: Request, res: Response) => {
    try {
      const {
        agentEmail,
        propertyId,
        recipientEmail,
        recipientEmails,
        message,
      } = req.body as any;

      if (!agentEmail || !propertyId || !message) {
        return res.status(400).json({ message: "Thiếu thông tin bắt buộc" });
      }

      const agent = await Agent.findOne({ email: agentEmail });
      if (!agent) return res.status(404).json({ message: "Agent not found" });

      const property = await Property.findById(propertyId);
      if (!property)
        return res.status(404).json({ message: "Không tìm thấy bất động sản" });

      // Xác nhận property thuộc đại lý này
      if (
        !property.agent ||
        property.agent.toString() !== agent._id.toString()
      ) {
        return res
          .status(403)
          .json({ message: "Bất động sản không thuộc đại lý này" });
      }

      // Xác định người nhận: hỗ trợ 1 hoặc nhiều email; nếu không truyền thì mặc định chủ bài đăng
      const recipientIds: string[] = [];
      if (
        recipientEmails &&
        Array.isArray(recipientEmails) &&
        recipientEmails.length > 0
      ) {
        const users = await User.find({
          email: { $in: recipientEmails },
        }).select("_id");
        if (!users || users.length === 0)
          return res
            .status(404)
            .json({ message: "Không tìm thấy người nhận hợp lệ" });
        recipientIds.push(...users.map((u) => u._id.toString()));
      } else if (recipientEmail) {
        // Handle comma-separated emails in recipientEmail field
        const emailList = recipientEmail
          .split(",")
          .map((e: string) => e.trim())
          .filter((e: string) => e.length > 0);

        if (emailList.length > 1) {
          // Multiple emails provided as comma-separated string
          const users = await User.find({
            email: { $in: emailList },
          }).select("_id");
          if (!users || users.length === 0)
            return res
              .status(404)
              .json({ message: "Không tìm thấy người nhận hợp lệ" });
          recipientIds.push(...users.map((u) => u._id.toString()));
        } else if (emailList.length === 1) {
          // Single email
          const u = await User.findOne({ email: emailList[0] });
          if (!u)
            return res
              .status(404)
              .json({ message: "Không tìm thấy người dùng nhận" });
          recipientIds.push(u._id.toString());
        } else if (property.userId) {
          // Empty email, send to property owner
          recipientIds.push(property.userId.toString());
        } else {
          return res
            .status(400)
            .json({ message: "Thiếu thông tin người nhận" });
        }
      } else if (property.userId) {
        recipientIds.push(property.userId.toString());
      } else {
        return res.status(400).json({ message: "Thiếu thông tin người nhận" });
      }

      const created = await Promise.all(
        recipientIds.map((rid) =>
          Message.create({
            propertyId,
            senderName: agent.name,
            senderPhone: agent.phone,
            senderEmail: agent.email,
            message,
            recipientUserId: rid,
          })
        )
      );

      const populated = await Message.find({
        _id: { $in: created.map((m) => m._id) },
      })
        .populate("propertyId", "title images location price")
        .populate("recipientUserId", "name email");

      res
        .status(201)
        .json({ message: "Gửi tin nhắn thành công", data: populated });
    } catch (err) {
      console.error("Send message from agent error:", err);
      res.status(500).json({ message: (err as any).message });
    }
  },

  // Tin nhắn tới các bài đăng thuộc đại lý (inbox đại lý)
  getMessagesForAgent: async (req: Request, res: Response) => {
    try {
      const {
        email,
        page = "1",
        limit = "10",
      } = req.query as { email?: string; page?: string; limit?: string };
      if (!email) return res.status(400).json({ message: "Missing email" });

      const agent = await Agent.findOne({ email });
      if (!agent) return res.status(404).json({ message: "Agent not found" });

      const props = await Property.find({ agent: agent._id }).select("_id");
      const propIds = props.map((p) => p._id);
      if (propIds.length === 0)
        return res.json({
          messages: [],
          pagination: {
            page: 1,
            limit: Number(limit),
            total: 0,
            totalPages: 0,
          },
        });

      const pageNum = parseInt(page!, 10);
      const limitNum = parseInt(limit!, 10);
      const skip = (pageNum - 1) * limitNum;

      const filter = { propertyId: { $in: propIds } } as any;
      const total = await Message.countDocuments(filter);
      const messages = await Message.find(filter)
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
      res.status(500).json({ message: (err as any).message });
    }
  },

  // Danh sách tin đã gửi theo email đại lý (phân trang)
  getMessagesSentByAgent: async (req: Request, res: Response) => {
    try {
      const {
        email,
        page = "1",
        limit = "10",
      } = req.query as { email?: string; page?: string; limit?: string };
      if (!email) return res.status(400).json({ message: "Missing email" });

      const pageNum = parseInt(page!, 10);
      const limitNum = parseInt(limit!, 10);
      const skip = (pageNum - 1) * limitNum;

      const filter = { senderEmail: email } as any;
      const total = await Message.countDocuments(filter);
      const messages = await Message.find(filter)
        .populate("propertyId", "title images location price")
        .populate("recipientUserId", "name email")
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
      res.status(500).json({ message: (err as any).message });
    }
  },

  // Liên hệ của đại lý: tập hợp người gửi tin nhắn + userId (chủ property) thuộc đại lý
  getAgentContacts: async (req: Request, res: Response) => {
    try {
      const {
        email,
        page = "1",
        limit = "4",
      } = req.query as {
        email?: string;
        page?: string;
        limit?: string;
      };
      if (!email) return res.status(400).json({ message: "Missing email" });

      const agent = await Agent.findOne({ email });
      if (!agent) return res.status(404).json({ message: "Agent not found" });

      const props = await Property.find({ agent: agent._id })
        .select("_id userId")
        .populate("userId", "name email phone");
      const propIds = props.map((p) => p._id);
      if (propIds.length === 0)
        return res.json({
          contacts: [],
          pagination: { page: 1, limit: 4, total: 0, totalPages: 0 },
        });

      const pageNum = parseInt(page!, 10);
      const limitNum = parseInt(limit!, 10);
      const skip = (pageNum - 1) * limitNum;

      // Lấy các sender unique từ messages
      const senderRows = await Message.aggregate([
        { $match: { propertyId: { $in: propIds } } },
        {
          $group: {
            _id: {
              email: "$senderEmail",
              phone: "$senderPhone",
              name: "$senderName",
            },
            lastMessageAt: { $max: "$createdAt" },
          },
        },
      ]);

      // Lấy danh sách userId unique từ properties (chủ property)
      const userIds = new Map<string, any>();
      for (const p of props) {
        if (p.userId && typeof p.userId === "object") {
          const u = p.userId as any;
          if (u._id && u.email) {
            const key = u.email;
            if (!userIds.has(key)) {
              userIds.set(key, {
                name: u.name || "Chủ property",
                email: u.email,
                phone: u.phone || "",
                lastMessageAt: null, // Có thể cập nhật sau nếu cần
              });
            }
          }
        }
      }

      // Merge senders và userIds
      const contactsMap = new Map<string, any>();

      // Add senders
      for (const r of senderRows) {
        const email = r._id.email || "";
        if (email && !contactsMap.has(email)) {
          contactsMap.set(email, {
            name: r._id.name,
            email: r._id.email,
            phone: r._id.phone,
            lastMessageAt: r.lastMessageAt,
          });
        }
      }

      // Add property owners
      for (const [key, value] of userIds) {
        if (!contactsMap.has(key)) {
          contactsMap.set(key, value);
        }
      }

      // Convert to array and sort
      const allContacts = Array.from(contactsMap.values()).sort((a, b) => {
        const aTime = a.lastMessageAt ? new Date(a.lastMessageAt).getTime() : 0;
        const bTime = b.lastMessageAt ? new Date(b.lastMessageAt).getTime() : 0;
        return bTime - aTime;
      });

      // Paginate
      const total = allContacts.length;
      const contacts = allContacts.slice(skip, skip + limitNum);

      res.json({
        contacts,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          totalPages: Math.ceil(total / limitNum),
        },
      });
    } catch (err) {
      res.status(500).json({ message: (err as any).message });
    }
  },
};
