import { Request, Response } from "express";
import User from "../../models/User.js";
import type { AuthRequest } from "../../middlewares/auth.middleware.js";

export const UserController = {
  getUsers: async (req: Request, res: Response) => {
    try {
      const { page = "1", limit = "10" } = req.query as {
        page?: string;
        limit?: string;
      };

      const pageNum = parseInt(page, 10);
      const limitNum = parseInt(limit, 10);
      const skip = (pageNum - 1) * limitNum;

      // Get total count for pagination
      const total = await User.countDocuments();

      // Get paginated users
      const users = await User.find()
        .select("-password")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum);

      res.json({
        users,
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

  createUser: async (req: Request, res: Response) => {
    try {
      const { name, email, password, phone } = req.body;
      if (!name || !email || !password || !phone) {
        return res.status(400).json({ message: "All fields required!" });
      }

      const existing = await User.findOne({ email });
      if (existing) {
        return res.status(400).json({ message: "Email already in use!" });
      }

      const user = await User.create({
        name,
        email,
        password,
        phone,
        role: "user",
      });
      const { password: _, ...out } = user.toObject();
      res.status(201).json(out);
    } catch (err) {
      res.status(400).json({ message: (err as any).message });
    }
  },

  updateUser: async (req: AuthRequest, res: Response) => {
    try {
      // Only admin can update users
      if (req.user?.role !== "admin") {
        return res.status(403).json({ message: "Forbidden - Admin only" });
      }

      const user = await User.findById(req.params.id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Don't allow password update via this endpoint
      const { password, role, ...updateData } = req.body;

      // Only allow updating specific fields
      if (updateData.name !== undefined) user.name = updateData.name;
      if (updateData.email !== undefined) user.email = updateData.email;
      if (updateData.phone !== undefined) user.phone = updateData.phone;
      if (updateData.isBanned !== undefined)
        user.isBanned = updateData.isBanned;
      if (updateData.avatarUrl !== undefined)
        user.avatarUrl = updateData.avatarUrl;

      await user.save();

      const { password: _, ...out } = user.toObject();
      res.json(out);
    } catch (err) {
      res.status(400).json({ message: (err as any).message });
    }
  },
};
