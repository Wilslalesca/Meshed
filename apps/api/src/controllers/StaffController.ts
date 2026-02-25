import { Response } from "express";
import { TeamStaffModel } from "../models/TeamStaffModel";
import { UserModel } from "../models/UserModel";
import { TeamModel } from "../models/TeamModel";
import { sendEmail } from "../services/emailService";
import crypto from "crypto";
import { InviteModel } from "../models/InviteModel";
import { Role } from "../types";
import { AuthedRequest } from "../middleware/authMiddleware";

function isManagerOrAdmin(role: Role | undefined) {
    return role === "manager" || role === "admin";
}

export class StaffController {
    static async getStaff(req: AuthedRequest, res: Response) {
        const { teamId } = req.params;
        const staff = await TeamStaffModel.getStaff(teamId);
        return res.json(staff);
    }

    static async addStaff(req: AuthedRequest, res: Response) {
        const userId = req.user?.id;
        if (!userId) return res.status(401).send("Unauthorized");

        let user = await UserModel.findById(userId);
        if (!user) return res.status(404).send("User not found");

        if (!isManagerOrAdmin(user.role))
            return res.status(403).send("Forbidden");

        const { teamId } = req.params;
        const { email, role, notes = null } = req.body || {};

        if (!email) return res.status(400).send("email required");

        user = await UserModel.findByEmail(email);
        let isGhost = false;

        if (!user) {
            user = await UserModel.createGhostUser(email);
            isGhost = true;
        }

        if (!user || user.id === null) {
            return res.status(500).send("Failed to find or create user");
        }

        const added = await TeamStaffModel.addStaff(
            teamId,
            user.id,
            role,
            notes,
        );
        const team = await TeamModel.getTeam(teamId);

        if (!team) return res.status(500).send("Team not found");

        if (isGhost) {
            const token = crypto.randomBytes(32).toString("hex");
            await InviteModel.createInvite(teamId, email, role, null, token);
            await sendEmail.sendEmailInvite(email, team.name, token);
        } else {
            await sendEmail.sendAddedToTeamEmail(email, team.name, role);
        }

        return res.json(added);
    }

    static async updateStaff(req: AuthedRequest, res: Response) {
        const userId = req.user?.id;
        if (!userId) return res.status(401).send("Unauthorized");

        const user = await UserModel.findById(userId);
        if (!user || !isManagerOrAdmin(user.role)) {
            return res.status(403).send("Forbidden");
        }

        const { staffId } = req.params;
        const updated = await TeamStaffModel.updateStaffById(staffId, req.body);
        if (!updated) return res.status(404).send("not found");

        return res.json(updated);
    }

    static async removeStaff(req: AuthedRequest, res: Response) {
        const userId = req.user?.id;
        if (!userId) return res.status(401).send("Unauthorized");

        const user = await UserModel.findById(userId);
        if (!user || !isManagerOrAdmin(user.role)) {
            return res.status(403).send("Forbidden");
        }

        const { staffId } = req.params;
        await TeamStaffModel.removeStaff(staffId);
        return res.json({ success: true });
    }
}
