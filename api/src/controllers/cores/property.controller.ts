import Property from "../../models/Property.js";
import Agent from "../../models/Agent.js"; // Import Agent model để register schema
import Message from "../../models/Message.js";
import User from "../../models/User.js";
import { Request, Response } from "express";
import type { AuthRequest } from "../../middlewares/auth.middleware.js";

export const PropertyController = {
  getProperties: async (req: AuthRequest, res: Response) => {
    try {
      const {
        page = "1",
        limit = "10",
        agentId,
        agentEmail,
        userEmail,
        userName,
        contactName,
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

      // Check if user wants to see their own posts (bypass filters)
      const isOwnerView = req.query.owner === "me" && req.user?.id;

      console.log("=== PROPERTY FILTER DEBUG ===");
      console.log("Request path:", req.path);
      console.log(
        "User:",
        req.user ? { id: req.user.id, role: req.user.role } : "No user"
      );
      console.log("Query owner:", req.query.owner);
      console.log("isOwnerView:", isOwnerView);
      console.log("waitingStatus param:", waitingStatus);

      // Apply waitingStatus and status filters based on user role and context
      if (isOwnerView) {
        // User viewing their own posts - NO waitingStatus/status filter
        // Will filter by userId below
        console.log("Applied filter: Owner view (no status filter)");
      } else if (req.user?.role === "admin") {
        // Admin can specify waitingStatus filter
        if (waitingStatus && waitingStatus !== "all") {
          filter.waitingStatus = waitingStatus;
          console.log(
            "Applied filter: Admin with waitingStatus =",
            waitingStatus
          );
        } else {
          console.log("Applied filter: Admin (no waitingStatus filter)");
        }
        // If no waitingStatus specified or "all", don't add any waitingStatus filter
      } else {
        // Public/default behaviour: only show reviewed and active properties
        filter.waitingStatus = "reviewed";
        filter.status = "active";
        console.log("Applied filter: Public (reviewed + active only)");
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

      // Filter properties by contact name who has messaged about the property
      if (contactName) {
        const q = contactName.trim();
        if (q.length > 0) {
          const propIds = await Message.distinct("propertyId", {
            senderName: { $regex: q, $options: "i" },
          });
          // If no matches, force empty result
          if (propIds.length === 0) {
            filter._id = { $in: [] };
          } else {
            filter._id = { ...(filter._id || {}), $in: propIds };
          }
        }
      }

      // Filter theo agentId / agentEmail nếu có
      if (agentId) {
        filter.agent = agentId;
      } else if (agentEmail) {
        const agentDoc = await Agent.findOne({ email: agentEmail as string });
        if (agentDoc) filter.agent = agentDoc._id;
        else filter.agent = null; // để kết quả rỗng nếu email không tồn tại
      }

      // If owner=me, filter by current user's id (takes priority)
      if (isOwnerView && req.user?.id) {
        filter.userId = req.user.id;
      } else if (userEmail || userName) {
        // Filter theo người đăng (user) qua email hoặc tên nếu có
        const uQuery: any = {};
        if (userEmail) {
          uQuery.email = {
            $regex: (userEmail as string).trim(),
            $options: "i",
          };
        }
        if (userName) {
          uQuery.name = { $regex: (userName as string).trim(), $options: "i" };
        }
        const users = await User.find(uQuery).select("_id");
        if (users.length === 0) {
          // Force empty result when no user matches
          filter._id = { $in: [] };
        } else {
          const ids = users.map((u) => u._id);
          filter.userId = { ...(filter.userId || {}), $in: ids };
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

      console.log("Final filter:", JSON.stringify(filter, null, 2));
      console.log("Total properties found:", total);
      console.log("=== END DEBUG ===\n");

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
      const property = await Property.findById(req.params.id)
        .populate("agent")
        .populate("userId", "name email phone");
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
