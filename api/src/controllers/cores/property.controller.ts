import Property from "../../models/Property.js";
import Agent from "../../models/Agent.js"; // Import Agent model để register schema
import { Request, Response } from "express";
import type { AuthRequest } from "../../middlewares/auth.middleware.js";

export const PropertyController = {
  getProperties: async (req: AuthRequest, res: Response) => {
    try {
      const {
        page = "1",
        limit = "10",
        waitingStatus,
        search,
        type,
        transactionType,
        model,
        propertyType,
        location,
        minPrice,
        maxPrice,
        minArea,
        maxArea,
        bedrooms,
        bathrooms,
        sort,
      } = req.query as Record<string, string | undefined>;

      const pageNum = parseInt(page as string, 10) || 1;
      const limitNum = parseInt(limit as string, 10) || 10;
      const skip = (pageNum - 1) * limitNum;

      // Build filter query
      const filter: any = {};

      // If the requester is admin allow using waitingStatus query param (or all).
      // Otherwise, restrict public views to reviewed + active posts only.
      if (req.user?.role === "admin") {
        if (waitingStatus && waitingStatus !== "all") {
          filter.waitingStatus = waitingStatus;
        }
      } else {
        // Public/default behaviour: only show reviewed and active properties
        filter.waitingStatus = "reviewed";
        filter.status = "active";
      }

      // Search in title or location
      if (search) {
        const q = search.trim();
        if (q.length > 0) {
          filter.$or = [
            { title: { $regex: q, $options: "i" } },
            { location: { $regex: q, $options: "i" } },
          ];
        }
      }

      // Transaction type: accept 'type' (frontend) or 'transactionType' (backend)
      const tx = (transactionType || type || "").toString();
      if (tx) {
        // frontend may send 'sale' while backend expects 'sell'
        const mapped = tx === "sale" ? "sell" : tx;
        if (mapped) filter.transactionType = mapped;
      }

      // Model / propertyType - try to accept both names but only apply if matches schema values
      const modelVal = (model || propertyType || "").toString();
      if (modelVal) {
        // map some common frontend values to schema values
        const mapping: Record<string, string> = {
          apartment: "flat",
          flat: "flat",
          land: "land",
        };
        const mappedModel = mapping[modelVal] || modelVal;
        if (["flat", "land"].includes(mappedModel)) {
          filter.model = mappedModel;
        }
      }

      if (location) {
        filter.location = { $regex: location, $options: "i" };
      }

      if (minPrice)
        filter.price = { ...(filter.price || {}), $gte: parseFloat(minPrice) };
      if (maxPrice)
        filter.price = { ...(filter.price || {}), $lte: parseFloat(maxPrice) };

      if (minArea)
        filter.area = { ...(filter.area || {}), $gte: parseFloat(minArea) };
      if (maxArea)
        filter.area = { ...(filter.area || {}), $lte: parseFloat(maxArea) };

      if (bedrooms) filter.bedrooms = parseInt(bedrooms as string, 10);
      if (bathrooms) filter.bathrooms = parseInt(bathrooms as string, 10);

      // Determine sort option
      let sortOption: any = { createdAt: -1 };
      if (sort) {
        switch (sort) {
          case "newest":
            sortOption = { createdAt: -1 };
            break;
          case "oldest":
            sortOption = { createdAt: 1 };
            break;
          case "price-asc":
            sortOption = { price: 1 };
            break;
          case "price-desc":
            sortOption = { price: -1 };
            break;
          case "area-asc":
            sortOption = { area: 1 };
            break;
          case "area-desc":
            sortOption = { area: -1 };
            break;
          default:
            sortOption = { createdAt: -1 };
        }
      }

      // Get total count for pagination (with same filter)
      const total = await Property.countDocuments(filter);

      // Get paginated properties
      const properties = await Property.find(filter)
        .populate("agent")
        .populate("userId", "name email phone")
        .sort(sortOption)
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

      // Tăng views lên 1
      property.views = (property.views || 0) + 1;
      await property.save();

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
