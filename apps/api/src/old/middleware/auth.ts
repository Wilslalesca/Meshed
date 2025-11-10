import { Request, Response, NextFunction } from "express";
import { verifyAccess } from "../auth/tokens";
import { Role } from "../old/types";

export interface AuthedRequest extends Request {
    user?: { id: string; role: Role };
}

export function requireAuth(
    req: AuthedRequest,
    res: Response,
    next: NextFunction
) {
    const header = req.header("Authorization");

    if (!header?.startsWith("Bearer ")) {
        return res.status(401).json({ error: "Missing token" });
    }
    const token = header.slice(7);

    try {
        const payload = verifyAccess(token);
        req.user = { id: payload.userId, role: payload.role };
        next();
    } catch {
        return res.status(401).json({ error: "Invalid or expired token" });
    }
}

export function requireRole(allowed: Role | Role[]) {
    const roles = Array.isArray(allowed) ? allowed : [allowed];

    return (req: AuthedRequest, res: Response, next: NextFunction) => {
        if (!req.user) {
            return res.status(401).json({ error: "Unauthenticated" });
        }

        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ error: "Forbidden" });
        }

        next();
    };
}
