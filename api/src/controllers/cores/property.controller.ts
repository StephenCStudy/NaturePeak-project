import Property from "../../models/Property.js";
import Agent from "../../models/Agent.js"; // Import Agent model để register schema
import { Request, Response } from "express";
import type { AuthRequest } from "../../middlewares/auth.middleware.js";

export const PropertyController = {
  getProperties: async (req: Request, res: Response) => {
    try {
      const {
        page = "1",
        limit = "10",
        waitingStatus,
      } = req.query as {
        page?: string;
        limit?: string;
        waitingStatus?: string;
      };

      const pageNum = parseInt(page, 10);
      const limitNum = parseInt(limit, 10);
      const skip = (pageNum - 1) * limitNum;

      // Build filter query
      const filter: any = {};
      if (waitingStatus && waitingStatus !== "all") {
        filter.waitingStatus = waitingStatus;
      }

      // Get total count for pagination
      const total = await Property.countDocuments(filter);

      // Get paginated properties
      const properties = await Property.find(filter)
        .populate("agent")
        .populate("userId", "name email phone")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum);

      res.json({
        properties,
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

  getProperty: async (req: Request, res: Response) => {
    try {
      const property = await Property.findById(req.params.id).populate("agent");
      if (!property)
        return res.status(404).json({ message: "Property not found" });
      res.json(property);
    } catch (err) {
      res.status(500).json({ message: (err as any).message });
    }
  },

  createProperty: async (req: AuthRequest, res: Response) => {
    try {
      const body: any = { ...req.body };
      if (req.user && req.user.id) body.userId = req.user.id;
      const property = await Property.create(body);
      res.status(201).json(property);
    } catch (err) {
      res.status(400).json({ message: (err as any).message });
    }
  },

  updateProperty: async (req: AuthRequest, res: Response) => {
    try {
      const property = await Property.findById(req.params.id);
      if (!property)
        return res.status(404).json({ message: "Property not found" });

      // ownership check: allow if admin or owner (userId or agent)
      const userId = req.user?.id;
      const isOwner =
        userId &&
        (property.userId?.toString() === userId ||
          property.agent?.toString() === userId);
      if (req.user?.role !== "admin" && !isOwner)
        return res.status(403).json({ message: "Forbidden" });

      Object.assign(property, req.body);
      await property.save();
      res.json(property);
    } catch (err) {
      res.status(400).json({ message: (err as any).message });
    }
  },

  deleteProperty: async (req: AuthRequest, res: Response) => {
    try {
      const property = await Property.findById(req.params.id);
      if (!property)
        return res.status(404).json({ message: "Property not found" });

      const userId = req.user?.id;
      const isOwner =
        userId &&
        (property.userId?.toString() === userId ||
          property.agent?.toString() === userId);
      if (req.user?.role !== "admin" && !isOwner)
        return res.status(403).json({ message: "Forbidden" });

      await property.deleteOne();
      res.json({ message: "Deleted" });
    } catch (err) {
      res.status(500).json({ message: (err as any).message });
    }
  },

  patchStatus: async (req: AuthRequest, res: Response) => {
    try {
      const property = await Property.findById(req.params.id);
      if (!property)
        return res.status(404).json({ message: "Property not found" });

      const userId = req.user?.id;
      const isOwner =
        userId &&
        (property.userId?.toString() === userId ||
          property.agent?.toString() === userId);
      if (req.user?.role !== "admin" && !isOwner)
        return res.status(403).json({ message: "Forbidden" });

      const { status } = req.body;
      if (status && ["active", "hidden"].includes(status)) {
        property.status = status;
      } else {
        // toggle
        property.status = property.status === "active" ? "hidden" : "active";
      }

      await property.save();
      res.json(property);
    } catch (err) {
      res.status(400).json({ message: (err as any).message });
    }
  },
};
