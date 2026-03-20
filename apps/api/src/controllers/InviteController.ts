import { Request, Response } from "express";
import { InviteModel } from "../models/InviteModel";
import { UserModel } from "../models/UserModel";
import { TeamRosterModel } from "../models/TeamRosterModel";
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

    await TeamRosterModel.addToTeam(teamId, user.id, role, position);

    return res.json({ success: true, invite, token });
  }

  static async acceptInvite(req: Request, res: Response) {
    const { token } = req.params;

    const invite = await InviteModel.findByToken(token);
    if (!invite) return res.status(404).send("Invalid invite");

    const user = await UserModel.findByEmail(invite.email);
    if (!user) return res.status(500).send("Ghost user missing");
    await UserModel.createMembership(user.id, invite.organization_id);
    await InviteModel.markAccepted(invite.id, invite.organization_id);    
    await TeamRosterModel.updateAthlete(invite.team_id, user.id, {
      status: "pending",
      position: invite.position ?? null
    });

    return res.json({ email: invite.email, role: invite.role, position: invite.position, token } );
  }
}
