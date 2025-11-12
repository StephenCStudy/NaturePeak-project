import { Request, Response } from "express";
import User from "../../models/User.js";

export const UserController = {
  getUsers: async (req: Request, res: Response) => {
    try {
      const users = await User.find().select("-password");
      res.json(users);
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

      const user = await User.create({ name, email, password, phone, role: "user" });
      const { password: _, ...out } = user.toObject();
      res.status(201).json(out);
    } catch (err) {
      res.status(400).json({ message: (err as any).message });
    }
  },
};
