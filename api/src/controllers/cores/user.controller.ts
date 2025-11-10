// Chứa logic xử lý request (vd: tạo user, đăng nhập,...)
import User from "../../models/User.js";

export const UserController = {
  getUsers: async (_: any, res: any) => {
    try {
      const users = await User.find();
      res.json(users);
    } catch (err) {
      res.status(500).json({ message: (err as any).message });
    }
  },

  createUser: async (req: any, res: any) => {
    const { name, email, password } = req.body;
    try {
      const user = await User.create({ name, email, password });
      res.status(201).json(user);
    } catch (err) {
      res.status(400).json({ message: (err as any).message });
    }
  },
};
