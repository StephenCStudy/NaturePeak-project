import Property from "../../models/Property.js";
import Agent from "../../models/Agent.js"; // Import Agent model để register schema
import { Request, Response } from "express";
import type { AuthRequest } from "../../middlewares/auth.middleware.js";

export const PropertyController = {
  getProperties: async (req: Request, res: Response) => {
    try {
      const properties = await Property.find().populate("agent");
      res.json(properties);
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
