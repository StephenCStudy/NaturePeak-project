import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import User from "../../models/User.js";
import type { AuthRequest } from "../../middlewares/auth.middleware.js";

export const UserController = {
  getUsers: async (req: Request, res: Response) => {
    try {
      const {
        page = "1",
        limit = "10",
        search,
        email,
        phone,
      } = req.query as {
        page?: string;
        limit?: string;
        search?: string;
        email?: string;
        phone?: string;
      };

      const pageNum = parseInt(page, 10);
      const limitNum = parseInt(limit, 10);
      const skip = (pageNum - 1) * limitNum;

      // Build filter query
      const filter: any = {};

      // Search by name, email, or phone (general search)
      if (search) {
        const q = search.trim();
        if (q.length > 0) {
          filter.$or = [
            { name: { $regex: q, $options: "i" } },
            { email: { $regex: q, $options: "i" } },
            { phone: { $regex: q, $options: "i" } },
          ];
        }
      }

      // Specific email filter
      if (email) {
        filter.email = { $regex: email.trim(), $options: "i" };
      }

      // Specific phone filter
      if (phone) {
        filter.phone = { $regex: phone.trim(), $options: "i" };
      }

      // Get total count for pagination
      const total = await User.countDocuments(filter);

      // Get paginated users
      const users = await User.find(filter)
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

  updateProfile: async (req: AuthRequest, res: Response) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ message: "Not authenticated" });
      }

      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // User can only update their own profile
      const { name, phone, avatarUrl } = req.body;

      // Update allowed fields
      if (name !== undefined) user.name = name;
      if (phone !== undefined) user.phone = phone;
      if (avatarUrl !== undefined) user.avatarUrl = avatarUrl;

      await user.save();

      const { password: _, ...out } = user.toObject();
      res.json(out);
    } catch (err) {
      res.status(400).json({ message: (err as any).message });
    }
  },

  getCurrentPassword: async (req: AuthRequest, res: Response) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ message: "Not authenticated" });
      }

      const user = await User.findById(userId).select("password");
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Return password hash for client-side validation
      res.json({ password: user.password });
    } catch (err) {
      res.status(500).json({ message: (err as any).message });
    }
  },

  verifyPassword: async (req: AuthRequest, res: Response) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ message: "Not authenticated" });
      }

      const { password } = req.body;
      if (!password) {
        return res.status(400).json({ message: "Password is required" });
      }

      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Verify password
      const isMatch = await bcrypt.compare(password, user.password);
      res.json({ isValid: isMatch });
    } catch (err) {
      res.status(500).json({ message: (err as any).message });
    }
  },

  changePassword: async (req: AuthRequest, res: Response) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ message: "Not authenticated" });
      }

      const { currentPassword, newPassword } = req.body;

      // Validate input
      if (!currentPassword || !newPassword) {
        return res
          .status(400)
          .json({ message: "Current password and new password are required" });
      }

      if (newPassword.length < 6) {
        return res
          .status(400)
          .json({ message: "New password must be at least 6 characters" });
      }

      // Find user
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Verify current password
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return res
          .status(401)
          .json({ message: "Current password is incorrect" });
      }

      // Hash new password
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      user.password = hashedPassword;
      await user.save();

      res.json({ message: "Password changed successfully" });
    } catch (err) {
      res.status(500).json({ message: (err as any).message });
    }
  },
};
