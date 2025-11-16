// apps/api/src/controllers/InviteController.ts
import { Request, Response } from "express";
import { InviteModel } from "../models/InviteModel";
import { UserModel } from "../models/UserModel";
import { TeamModel } from "../models/TeamModel";
import crypto from "crypto";

export class InviteController {

  static async invite(req: any, res: Response) {
    const { teamId } = req.params;
    const { email, role = "athlete", position = null } = req.body;

    if (!email) return res.status(400).send("email required");

    const user = await UserModel.createGhostUser(email.trim());

    const token = crypto.randomBytes(32).toString("hex");

    const invite = await InviteModel.createInvite(
      teamId,
      email,
      role,
      position,
      token
    );

    await TeamModel.addUserToTeam(teamId, user.id, role, position, "pending");

    return res.json({ success: true, invite, token });
  }

  static async acceptInvite(req: Request, res: Response) {
    const { token } = req.params;

    const invite = await InviteModel.findByToken(token);
    if (!invite) return res.status(404).send("Invalid invite");

    const user = await UserModel.findByEmail(invite.email);
    if (!user) return res.status(500).send("Ghost user missing");

    await InviteModel.markAccepted(invite.id);

    await UserModel.activateUser(user.id);

    await TeamModel.updateUserStatus(invite.team_id, user.id, "active");

    return res.json({ success: true });
  }
}
