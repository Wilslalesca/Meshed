import { Request, Response, NextFunction, } from "express";
import type { RequestHandler } from "express";
import { verifyAccess } from "../utils/tokens";
import { Role } from "../types/index";

export interface AuthedRequest extends Request {
    user?: { id: string; role: Role };
}



export const requireAuth: RequestHandler = (req, res, next) => {
  const header = req.header("Authorization");
  if (!header?.startsWith("Bearer ")) {
    res.status(401).json({ error: "Missing token" });
    return;
  }

  try {
    const payload = verifyAccess(header.slice(7));
    (req as any).user = { id: payload.userId, role: payload.role };
    next();
  } catch {
    res.status(401).json({ error: "Invalid or expired token" });
    return;
  }
};



export function requireRole(allowed: Role | Role[]) {
  const roles = Array.isArray(allowed) ? allowed : [allowed];

  return function (req: AuthedRequest, res: Response, next: NextFunction): void {
    if (!req.user) {
      res.status(401).json({ error: "Unauthenticated" });
      return;
    }

    if (!roles.includes(req.user.role)) {
      res.status(403).json({ error: "Forbidden" });
      return;
    }

    next();
  };
}
