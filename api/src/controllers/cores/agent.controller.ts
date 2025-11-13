/**
 * Agent Controller
 *
 * Quản lý thông tin liên hệ của người đăng tin bất động sản.
 * Agent chứa thông tin: tên, email, số điện thoại, công ty môi giới.
 *
 * Chức năng hỗ trợ:
 * - Lấy danh sách tất cả agents (public)
 * - Lấy chi tiết một agent theo ID (public)
 * - Tạo mới agent (cần authentication)
 * - Cập nhật thông tin agent (cần authentication)
 * - Xóa agent (cần authentication)
 *
 * Sử dụng khi:
 * - Người dùng đăng tin mới: tạo agent với thông tin liên hệ
 * - Chỉnh sửa tin đăng: cập nhật thông tin agent hiện tại
 * - Hiển thị thông tin liên hệ trong trang chi tiết property
 */

import Agent from "../../models/Agent.js";
import { Request, Response } from "express";
import type { AuthRequest } from "../../middlewares/auth.middleware.js";

export const AgentController = {
  /**
   * GET /api/agents
   * Lấy danh sách tất cả agents
   * Public route - không cần authentication
   */
  getAgents: async (req: Request, res: Response) => {
    try {
      // Hỗ trợ filter theo email nếu có query ?email=
      const { email } = req.query as { email?: string };
      if (email) {
        const agent = await Agent.findOne({ email });
        if (!agent) return res.status(404).json({ message: "Agent not found" });
        return res.json(agent);
      }

      const agents = await Agent.find();
      res.json(agents);
    } catch (err) {
      res.status(500).json({ message: (err as any).message });
    }
  },

  /**
   * GET /api/agents/by-email?email=...
   * Trả về 1 agent theo email (tiện cho client kiểm tra truy cập đại lý)
   */
  getAgentByEmail: async (req: Request, res: Response) => {
    try {
      const { email } = req.query as { email?: string };
      if (!email) return res.status(400).json({ message: "Missing email" });
      const agent = await Agent.findOne({ email });
      if (!agent) return res.status(404).json({ message: "Agent not found" });
      res.json(agent);
    } catch (err) {
      res.status(500).json({ message: (err as any).message });
    }
  },

  /**
   * GET /api/agents/:id
   * Lấy thông tin chi tiết một agent theo ID
   * Public route - không cần authentication
   *
   * @param id - Agent ID trong URL params
   */
  getAgent: async (req: Request, res: Response) => {
    try {
      const agent = await Agent.findById(req.params.id);
      if (!agent) return res.status(404).json({ message: "Agent not found" });
      res.json(agent);
    } catch (err) {
      res.status(500).json({ message: (err as any).message });
    }
  },

  /**
   * POST /api/agents
   * Tạo mới agent với thông tin liên hệ
   * Protected route - cần authentication
   *
   * Request body: { name, email, phone, agency?, agentcyImg? }
   * Response: Agent object với _id
   */
  createAgent: async (req: AuthRequest, res: Response) => {
    try {
      const agent = await Agent.create(req.body);
      res.status(201).json(agent);
    } catch (err) {
      res.status(400).json({ message: (err as any).message });
    }
  },

  /**
   * PUT /api/agents/:id
   * Cập nhật thông tin agent hiện tại
   * Protected route - cần authentication
   *
   * @param id - Agent ID trong URL params
   * Request body: { name?, email?, phone?, agency?, agentcyImg? }
   */
  updateAgent: async (req: AuthRequest, res: Response) => {
    try {
      const agent = await Agent.findById(req.params.id);
      if (!agent) return res.status(404).json({ message: "Agent not found" });

      Object.assign(agent, req.body);
      await agent.save();
      res.json(agent);
    } catch (err) {
      res.status(400).json({ message: (err as any).message });
    }
  },

  /**
   * DELETE /api/agents/:id
   * Xóa agent theo ID
   * Protected route - cần authentication
   *
   * @param id - Agent ID trong URL params
   * Note: Cần cẩn thận khi xóa, có thể ảnh hưởng đến properties liên quan
   */
  deleteAgent: async (req: AuthRequest, res: Response) => {
    try {
      const agent = await Agent.findById(req.params.id);
      if (!agent) return res.status(404).json({ message: "Agent not found" });

      await agent.deleteOne();
      res.json({ message: "Deleted" });
    } catch (err) {
      res.status(500).json({ message: (err as any).message });
    }
  },
};
