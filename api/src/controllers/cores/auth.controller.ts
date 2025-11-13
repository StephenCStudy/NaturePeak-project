import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import User from "../../models/User.js";
import Agent from "../../models/Agent.js";
import type { AuthRequest } from "../../middlewares/auth.middleware.js";
import { revokeToken } from "../../middlewares/auth.middleware.js";

const JWT_SECRET = process.env.JWT_SECRET || "secret";

export const AuthController = {
  register: async (req: Request, res: Response) => {
    try {
      const { name, email, password, phone, isAgent } = req.body as any;
      if (!email || !password || !name || !phone)
        return res.status(400).json({ message: "All fields required!" });

      const existing = await User.findOne({ email });
      if (existing)
        return res.status(400).json({ message: "Email already in use!" });

      const hashed = await bcrypt.hash(password, 10);
      const user = await User.create({
        name,
        email,
        phone,
        password: hashed,
        role: "user",
        createdAt: new Date(),
      });

      // Optionally create Agent profile if requested
      if (isAgent === true || isAgent === "true") {
        const existedAgent = await Agent.findOne({ email });
        if (!existedAgent) {
          await Agent.create({
            name,
            email,
            phone,
            password: hashed,
          });
        }
      }

      const { password: _, ...userData } = user.toObject();
      res.status(201).json(userData);
    } catch (err) {
      return res.status(500).json({
        message: (err as Error).message || "Internal server error",
      });
    }
  },

  login: async (req: Request, res: Response) => {
    try {
      const { email, password, rememberMe } = req.body;
      if (!email || !password)
        return res.status(400).json({ message: "Missing email or password" });
      // Try to find a regular user first
      const user = await User.findOne({ email });
      if (user) {
        // Check if user is banned
        if (user.isBanned) {
          return res.status(403).json({
            message:
              "Tài khoản của bạn đã bị khóa do vi phạm điều khoản dịch vụ. Vui lòng liên hệ admin để được hỗ trợ.",
            isBanned: true,
          });
        }

        const match = await bcrypt.compare(password, user.password);
        if (!match)
          return res.status(401).json({ message: "Invalid credentials" });

        const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, {
          expiresIn: "30m",
        });

        // Generate remember token if rememberMe is true
        let rememberToken = null;
        if (rememberMe) {
          rememberToken = crypto.randomBytes(64).toString("hex");
          const rememberTokenExpires = new Date();
          rememberTokenExpires.setHours(rememberTokenExpires.getHours() + 24); // 24 giờ

          user.rememberToken = rememberToken;
          user.rememberTokenExpires = rememberTokenExpires;
          await user.save();
        } else {
          // Clear remember token if not remembering
          user.rememberToken = null as any;
          user.rememberTokenExpires = null as any;
          await user.save();
        }

        return res.json({
          token,
          rememberToken,
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            role: user.role,
            avatarUrl: user.avatarUrl,
            isBanned: user.isBanned,
          },
        });
      }

      // If no user found, try Agent collection (agents can login)
      const agent = await Agent.findOne({ email });
      if (!agent)
        return res.status(401).json({ message: "Invalid credentials" });

      const matchAgent = await bcrypt.compare(password, agent.password || "");
      if (!matchAgent)
        return res.status(401).json({ message: "Invalid credentials" });

      // Sign token with role 'agent'
      const token = jwt.sign({ id: agent._id, role: "agent" }, JWT_SECRET, {
        expiresIn: "30m",
      });

      // Agents: no remember token support in this seed implementation
      return res.json({
        token,
        rememberToken: null,
        user: {
          id: agent._id,
          name: agent.name,
          email: agent.email,
          phone: agent.phone,
          role: "agent",
          avatarUrl: agent.agentcyImg || null,
          isBanned: false,
        },
      });
    } catch (err) {
      res.status(500).json({ message: (err as any).message });
    }
  },

  logout: async (req: AuthRequest, res: Response) => {
    try {
      const authHeader =
        req.headers.authorization ||
        (req.headers.Authorization as string | undefined);
      const token =
        authHeader && authHeader.startsWith("Bearer ")
          ? authHeader.split(" ")[1]
          : null;

      if (!token) return res.status(400).json({ message: "No token provided" });

      revokeToken(token);
      res.json({ message: "Logged out successfully" });
    } catch (err) {
      res.status(500).json({ message: (err as any).message });
    }
  },

  me: async (req: AuthRequest, res: Response) => {
    try {
      const userId = req.user?.id;
      if (!userId)
        return res.status(401).json({ message: "Not authenticated" });

      const user = await User.findById(userId).select("-password");
      if (!user) return res.status(404).json({ message: "User not found" });

      res.json(user);
    } catch (err) {
      res.status(500).json({ message: (err as any).message });
    }
  },

  rememberLogin: async (req: Request, res: Response) => {
    try {
      const { rememberToken } = req.body;
      if (!rememberToken)
        return res.status(400).json({ message: "Remember token required" });

      const user = await User.findOne({ rememberToken });
      if (!user)
        return res.status(401).json({ message: "Invalid remember token" });

      // Check if remember token has expired
      if (
        !user.rememberTokenExpires ||
        user.rememberTokenExpires < new Date()
      ) {
        user.rememberToken = null as any;
        user.rememberTokenExpires = null as any;
        await user.save();
        return res.status(401).json({ message: "Remember token expired" });
      }

      // Check if user is banned
      if (user.isBanned) {
        // Clear remember token for banned users
        user.rememberToken = null as any;
        user.rememberTokenExpires = null as any;
        await user.save();

        return res.status(403).json({
          message:
            "Tài khoản của bạn đã bị khóa do vi phạm điều khoản dịch vụ. Vui lòng liên hệ admin để được hỗ trợ.",
          isBanned: true,
        });
      }

      // Generate new JWT token
      const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, {
        expiresIn: "30m", // 30 phút
      });

      res.json({
        token,
        rememberToken, // Keep the same remember token
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
          avatarUrl: user.avatarUrl,
          isBanned: user.isBanned,
        },
      });
    } catch (err) {
      res.status(500).json({ message: (err as any).message });
    }
  },
};
