import { Request, Response } from "express";
import { AuthedRequest } from "../middleware/authMiddleware";
import { UserModel } from "../models/UserModel";
import { z } from "zod";
import type { Role, SafeUser, User} from "../types";

const userSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().optional(),
  email: z.string().email(),
  password: z.string().min(8),
  phone: z.string().optional(),
  role: z.enum(["admin", "manager", "user"]).optional().default("user"),
  active: z.boolean().optional(),
  verified:z.boolean().optional(),
  created_at: z.string().datetime().optional(),
  updated_at: z.string().datetime().optional(),
});

function toSafeUserFromUser(user: User, organizationId: string, organizationRole: Role): SafeUser {
  const mappedUser = user as User & { firstName: string; lastName?: string | null; };

  return {
    id: mappedUser.id,
    firstName: mappedUser.firstName,
    lastName: mappedUser.lastName ?? null,
    email: mappedUser.email,
    phone: mappedUser.phone ?? null,
    role: mappedUser.role,
    active: mappedUser.active,
    verified: mappedUser.verified,
    createdAt: mappedUser.createdAt,
    updatedAt: mappedUser.updatedAt,
    organizationId,
    organizationRole,
  };
}
const updateProfileSchema = userSchema.partial();

export const UserController = {

    async me(req: AuthedRequest, res: Response) {
        if (!req.user) return res.status(401).json({ error: "Unauthorized" });
        const user = await UserModel.findById(req.user!.id);
        if (!user) return res.status(404).json({ error: "User not found" });
        return res.json(toSafeUserFromUser(user, req.user.organizationId, req.user.organizationRole))
    },

    adminPing(_req: AuthedRequest, res: Response) {
        res.json({ ok: true, msg: "admin ok" });
    },

    managerPing(_req: AuthedRequest, res: Response) {
        res.json({ ok: true, msg: "manager ok" });
    },

    async updateUser(req: Request, res: Response){
        const { user_id, profile } = req.body;
        const parseUser = updateProfileSchema.safeParse(profile);
        if (!parseUser.success) return res.status(400).json({ error: "Validation error", details: parseUser.error.flatten() });
        
        try{
            const updated = await UserModel.updateUser(user_id, profile);
            if (!updated) return res.status(404).json({ message: "Course not found" });
            res.status(200).json({ message: "Profile updated", success: true });
        }
        catch(err){
            console.error("Error updating user profile:", err);
            res.status(500).json({ message: "Internal server error", success: false });
        }
    },
};