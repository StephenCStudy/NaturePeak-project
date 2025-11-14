import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "secret";

// In-memory token blacklist. For production use a persistent store (Redis, DB).
const tokenBlacklist = new Set<string>();

export const revokeToken = (token: string) => {
  try {
    const payload = jwt.decode(token) as any;
    if (payload && payload.exp) {
      const ttl = payload.exp * 1000 - Date.now();
      tokenBlacklist.add(token);
      if (ttl > 0) {
        setTimeout(() => tokenBlacklist.delete(token), ttl + 1000);
      }
    } else {
      tokenBlacklist.add(token);
    }
  } catch (err) {
    tokenBlacklist.add(token);
  }
};

export interface AuthRequest extends Request {
  user?: { id: string; role?: string };
}

export const authenticate = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader =
    req.headers.authorization ||
    (req.headers.Authorization as string | undefined);
  const token =
    authHeader && authHeader.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : undefined;
  if (!token) return res.status(401).json({ message: "No token provided" });

  if (tokenBlacklist.has(token))
    return res.status(401).json({ message: "Token revoked" });

  try {
    const payload = jwt.verify(token, JWT_SECRET) as any;
    req.user = { id: payload.id || payload._id, role: payload.role };
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

// Optional authentication - adds user info if token present, but doesn't reject if missing
export const optionalAuth = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader =
    req.headers.authorization ||
    (req.headers.Authorization as string | undefined);
  const token =
    authHeader && authHeader.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : undefined;

  if (!token) {
    // No token, continue as guest
    next();
    return;
  }

  if (tokenBlacklist.has(token)) {
    // Token revoked, continue as guest
    next();
    return;
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET) as any;
    req.user = { id: payload.id || payload._id, role: payload.role };
    next();
  } catch (err) {
    // Invalid token, continue as guest
    next();
  }
};

export const requireRole = (roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user)
      return res.status(401).json({ message: "Not authenticated" });
    if (!roles.includes(req.user.role || ""))
      return res.status(403).json({ message: "Forbidden" });
    next();
  };
};

export default { authenticate, optionalAuth, requireRole, revokeToken };
