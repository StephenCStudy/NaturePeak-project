import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../../models/User.js";
import type { AuthRequest } from "../../middlewares/auth.middleware.js";

const JWT_SECRET = process.env.JWT_SECRET;

export const AuthController = {
  register: async (req: Request, res: Response) => {
    try {
      const { name, email, password, phone } = req.body;
      if (!email || !password || !name || !phone)
        res.status(400).json({ message: "All fields required!" });

      const existing = await User.findOne({ email });
      if (existing)
        return res.status(400).json({ message: "Email already in use!!" });

      const hashed = await bcrypt.hash(password, 10);
      const user = await User.create({
        name,
        email,
        phone,
        password: hashed,
        role: "user",
        createdAt: new Date(),
      });

      // do not return password
      const { password: _, ...out } = user.toObject();
      res.status(201).json(out);
    } catch (err) {
      return res.status(500).json({
        message: (err as Error).message || "Internal server error",
      });
    }
  },

  login: async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
      if (!email || !password)
        return res.status(400).json({ message: "Missing email or password" });

      const user = await User.findOne({ email });
      if (!user)
        return res.status(401).json({ message: "Invalid credentials" });

      const match = await bcrypt.compare(password, user.password);
      if (!match)
        return res.status(401).json({ message: "Invalid credentials" });

      const token = jwt.sign(
        { id: user._id, role: (user as any).role },
        JWT_SECRET as any,
        { expiresIn: "7d" }
      );
      res.json({ token });
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
};
