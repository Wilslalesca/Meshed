import { Request, Response } from "express";
import { InviteModel } from "../models/InviteModel";
import { UserModel } from "../models/UserModel";
import { TeamRosterModel } from "../models/TeamRosterModel";
import { TeamModel } from "../models/TeamModel";
import { sendEmail } from "../services/emailService";
import crypto from "crypto";

export class InviteController {

  static async invite(req: any, res: Response) {
    const { teamId } = req.params;
    const { email, role = "athlete", position = null } = req.body;

    if (!email) return res.status(400).send("email required");

    const team = await TeamModel.getTeam(teamId);
    if (!team) return res.status(404).send("Team not found");

    const normalizedEmail = email.trim().toLowerCase();

    const user = await UserModel.createGhostUser(normalizedEmail);

    const token = crypto.randomBytes(32).toString("hex");

    const invite = await InviteModel.createInvite(
      teamId,
      normalizedEmail,
      role,
      position,
      token
    );

    await TeamRosterModel.addToTeam(teamId, user.id, role, position);
    await sendEmail.sendEmailInvite(normalizedEmail, team.name, token);

    return res.json({ success: true, invite, token });
  }

  static async acceptInvite(req: Request, res: Response) {
    const { token } = req.params;

    const invite = await InviteModel.findByToken(token);
    if (!invite) return res.status(404).send("Invalid invite");

    const user = await UserModel.findByEmail(invite.email);
    if (!user) return res.status(500).send("Ghost user missing");

    await InviteModel.markAccepted(invite.id);

    // await UserModel.updateUser(user.id, { active: true });
    
    await TeamRosterModel.updateAthlete(invite.team_id, user.id, {
      status: "pending",
      position: invite.position ?? null
    });

    return res.json({ email: invite.email, role: invite.role, position: invite.position, token } );
  }
}
