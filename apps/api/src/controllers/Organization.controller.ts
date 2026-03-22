import { Response } from "express";
import { AuthedRequest } from "../middleware/authMiddleware";
import { z } from "zod";
import crypto from "crypto";
import { OrganizationModel } from "../models/OrganizationModel";
import { UserModel } from "../models/UserModel";
import { InviteModel } from "../models/InviteModel";
import { sendEmail } from "../services/emailService";

const updateOrganizationSchema = z.object({
    name: z.string().min(1).optional(),
    active: z.boolean().optional(),
});

const updateUserRoleSchema = z.object({
    role: z.enum(["admin", "manager", "user"]),
});

const updateUserStatusSchema = z.object({
    status: z.enum(["active", "inactive"]),
});

function isAdmin(role?: string) {
    return role === "admin";
}

function isManagerOrAdmin(role?: string) {
    return role === "admin" || role === "manager";
}


export class OrganizationController {
    
    static async get(req: AuthedRequest, res: Response) {
        if (!req.user) return res.status(401).send("Unauthorized");
        const val = await OrganizationModel.findById(req.user.organizationId);
        if (!val) return res.status(404).send("Organization not found");
        return res.json(val);
    }

    static async getAll(req: AuthedRequest, res: Response) {
        if (!req.user) return res.status(401).send("Unauthorized");
        if (!isAdmin(req.user.organizationRole)) return res.status(403).send("Forbidden");
        const val = await OrganizationModel.findAll();
        return res.json(val);
    }

    static async create(req: AuthedRequest, res: Response) {
        if (!req.user) return res.status(401).send("Unauthorized");
        if (!isAdmin(req.user.organizationRole)) return res.status(403).send("Forbidden");

        const verified = z.object({ name: z.string().min(1) }).safeParse(req.body);
        if (!verified.success) return res.status(400).json({ error: "Validation error", details: verified.error.flatten() });

        const val = await OrganizationModel.create(verified.data.name);
        return res.status(201).json(val);
    }

    static async update(req: AuthedRequest, res: Response) {
        if (!req.user) return res.status(401).send("Unauthorized");
        if (!isAdmin(req.user.organizationRole)) return res.status(403).send("Forbidden");

        const verified = updateOrganizationSchema.safeParse(req.body);
        if (!verified.success) return res.status(400).json({ error: "Validation error", details: verified.error.flatten() });

        const val = await OrganizationModel.update(req.user.organizationId, verified.data);
        if (!val) return res.status(404).send("Organization not found");

        return res.json(val);
    }

    static async delete(req: AuthedRequest, res: Response) {
        if (!req.user) return res.status(401).send("Unauthorized");
        if (!isAdmin(req.user.organizationRole)) return res.status(403).send("Forbidden");

        const val = await OrganizationModel.delete(req.user.organizationId);
        if (!val) return res.status(404).send("Organization not found");

        return res.json({ success: true });
    }

    static async listUsers(req: AuthedRequest, res: Response) {
        if (!req.user) return res.status(401).send("Unauthorized");
        if (!isManagerOrAdmin(req.user.organizationRole)) return res.status(403).send("Forbidden");

        const val = await OrganizationModel.listUsers(req.user.organizationId);
        return res.json(val);
    }

    static async addUser(req: AuthedRequest, res: Response) {
        if (!req.user) return res.status(401).send("Unauthorized");
        if (!isAdmin(req.user.organizationRole)) return res.status(403).send("Forbidden");
        const newUser = z.object({ email: z.string().email(), role: z.enum(["admin", "manager", "user"]).default("user") }).safeParse(req.body);
        if (!newUser.success) return res.status(400).json({ error: "Validation error", details: newUser.error.flatten() });
        const { email, role } = newUser.data;
        const normalizedEmail = email.toLowerCase().trim();
        let user = await UserModel.findByEmail(normalizedEmail);
        let isGhost = false;
        if (!user) {
            user = await UserModel.createGhostUser(normalizedEmail);
            isGhost = true;
        }
        const membership = await OrganizationModel.addUser(req.user.organizationId, user!.id, role);
        if (isGhost) {
            const token = crypto.randomBytes(32).toString("hex");
            await InviteModel.createInvite(req.user.organizationId, null, normalizedEmail, role, null, token);
            await sendEmail.sendOrganizationInviteEmail(normalizedEmail, req.user.organizationId, token);
        }
        return res.status(201).json({ ...membership, invited: isGhost });
    }

    static async removeUser(req: AuthedRequest, res: Response) {
        if (!req.user) return res.status(401).send("Unauthorized");
        if (!isAdmin(req.user.organizationRole)) return res.status(403).send("Forbidden");
        const { membershipId } = req.params;
        const membership = await OrganizationModel.findMembershipById(membershipId, req.user.organizationId);
        if (!membership) return res.status(404).send("Membership not found");

        // block user from removing themselves
        if (membership.user_id === req.user.id) return res.status(400).json({ error: "You cannot remove yourself from the organization" });

        const removed = await OrganizationModel.removeUser(membershipId, req.user.organizationId);

        if (!removed) return res.status(404).send("Membership not found")
        return res.json({ success: true });
    }

    static async updateUserRole(req: AuthedRequest, res: Response) {
        if (!req.user) return res.status(401).send("Unauthorized");
        if (!isAdmin(req.user.organizationRole)) return res.status(403).send("Forbidden");

        const { membershipId } = req.params;
        const verified = updateUserRoleSchema.safeParse(req.body);

        if (!verified.success) return res.status(400).json({ error: "Validation error", details: verified.error.flatten() });
        const updated = await OrganizationModel.updateUserRole(membershipId, req.user.organizationId, verified.data.role);

        if (!updated) return res.status(404).send("Membership not found");
        return res.json(updated);
    }

    static async updateUserStatus(req: AuthedRequest, res: Response) {
        if (!req.user) return res.status(401).send("Unauthorized");
        if (!isManagerOrAdmin(req.user.organizationRole)) return res.status(403).send("Forbidden");
        
        const { membershipId } = req.params;
        const membership = await OrganizationModel.findMembershipById(membershipId, req.user.organizationId);
        if (!membership) return res.status(404).send("Membership not found");
        
        // block user from deactivating themselves
        if (membership.user_id === req.user.id) return res.status(400).json({ error: "You cannot change your own status" });
        
        const verified = updateUserStatusSchema.safeParse(req.body);

        if (!verified.success) return res.status(400).json({ error: "Validation error", details: verified.error.flatten() });
        const val = await OrganizationModel.updateUserStatus(membershipId, req.user.organizationId, verified.data.status);
        if (!val) return res.status(404).send("Membership not found");
        return res.json(val);
    }
}