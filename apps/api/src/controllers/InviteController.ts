import { Request, Response } from "express";
import { InviteModel } from "../models/InviteModel";
import { UserModel } from "../models/UserModel";
import { TeamRosterModel } from "../models/TeamRosterModel";
import { TeamStaffModel } from "../models/TeamStaffModel";
import { ActivityLogModel } from "../models/ActivityLogModel";
import * as notifications from "../features/notifications/notifications.service";
import crypto from "crypto";
import { AuthedRequest } from "../middleware/authMiddleware";

export class InviteController {

  static async invite(req: AuthedRequest, res: Response) {
    if (!req.user) return res.status(401).send("Unauthorized");
    const { teamId } = req.params;
    const { email, role = "athlete", position = null } = req.body;

    if (!email) return res.status(400).send("email required");

    const user = await UserModel.createGhostUser(email.trim().toLowerCase());
    const token = crypto.randomBytes(32).toString("hex");

    const invite = await InviteModel.createInvite(
      req.user.organizationId,
      teamId,
      email,
      role,
      position,
      token
    );

    if (role === "manager") {
      const staff = await TeamStaffModel.findStaffRecord(teamId, user.id);
      if (staff) {
        await TeamStaffModel.updateStaffById(staff.id, { role, status: "pending" });
      } else {
        await TeamStaffModel.addStaff(teamId, user.id, role, null);
      }
    } else {
      await TeamRosterModel.addToTeam(teamId, user.id, "athlete", position, "pending");
    }

    return res.json({ success: true, invite, token });
  }

  static async acceptInvite(req: Request, res: Response) {
    const { token } = req.params;

    const invite = await InviteModel.findByToken(token);
    if (!invite) return res.status(404).send("Invalid invite");

    const user = await UserModel.findByEmail(invite.email);
    if (!user) return res.status(500).send("Ghost user missing");

    const hasFullAccount = Boolean(user.verified) && Boolean(user.passwordHash?.trim());

    if (hasFullAccount) {
      const membershipRole = invite.role === "manager" ? "manager" : "user";
      await UserModel.createMembership(user.id, invite.organization_id, membershipRole);

      if (invite.role === "manager") {
        const staff = await TeamStaffModel.findStaffRecord(invite.team_id, user.id);
        if (staff) {
          await TeamStaffModel.updateStaffById(staff.id, { role: invite.role, status: "pending" });
        } else {
          await TeamStaffModel.addStaff(invite.team_id, user.id, invite.role, null);
        }
      } else {

        await TeamRosterModel.addToTeam(invite.team_id, user.id, "athlete", invite.position ?? null);
        await TeamRosterModel.updateAthlete(invite.team_id, user.id, {
          status: "pending",
          position: invite.position ?? null,
        });
      }

      await InviteModel.markAccepted(invite.id, invite.organization_id);
      await ActivityLogModel.log(invite.organization_id, user.id, "INVITE_ACCEPTED", "invite", invite.id);

      const managerIds = await TeamStaffModel.getActiveManagerIds(invite.team_id);
      await Promise.all(
        managerIds
          .filter((id) => id !== user.id)
          .map((managerId) =>
            notifications.createForUser(
              invite.organization_id,
              managerId,
              "INVITE_ACCEPTED",
              `${invite.email} accepted their invite`,
              { teamId: invite.team_id, inviteId: invite.id, email: invite.email },
            ),
          ),
      );

      return res.json({
        email: invite.email,
        role: invite.role,
        position: invite.position,
        token,
        next: "login",
      });
    }

    return res.json({ email: invite.email, role: invite.role, position: invite.position, token, next: "register" });
  }
}
