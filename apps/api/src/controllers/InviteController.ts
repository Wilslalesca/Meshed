import { Request, Response } from "express";
import { InviteModel } from "../models/InviteModel";
import { UserModel } from "../models/UserModel";
import { TeamRosterModel } from "../models/TeamRosterModel";
import { TeamStaffModel } from "../models/TeamStaffModel";
import { EmailService } from "../services/emailService";
import { TeamModel } from "../models/TeamModel";


const genCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};


export class InviteController {

  static async invite(req: any, res: Response) {
    const { teamId } = req.params;
    const { email, role = "athlete", position = null } = req.body;

    
    if (!email) return res.status(400).send("email required");

    // make sure email is trimmed from whitespace and lowercased from user input 
    const trimmed = email.trim().toLowerCase();
    const team = await TeamModel.getTeam(teamId);

    // make sure the team actually exists
    if (!team) return res.status(404).send("Team not found");

    let user = await UserModel.findByEmail(trimmed);

    // check if there is a user in the db, if not we will create a ghost user until they create an account
    if (!user) {
      user = await UserModel.createGhostUser(trimmed);
    }

    // generate teh 6 digit code
    const code = genCode();


    const invite = await InviteModel.createInvite(
      teamId,
      trimmed,
      role,
      position,
      code
    );

    // check if its a manager 
    if ( role === "manager" || role === "coach" ) {
      await TeamStaffModel.addStaff(teamId, user!.id, role, null);
    }
    else {
      await TeamRosterModel.addToTeam(teamId, user!.id, role, position);
      await TeamRosterModel.updateAthlete(teamId, user!.id, { status: "invited" });
    }

    await EmailService.sendInviteEmail(trimmed, code, team.name);

    return res.json({ success: true, invite });
  }

  static async verify(req: Request, res: Response) {
    const { email, code } = req.body;

    if (!email || !code) return res.status(400).send("Missing parameters");
    
    const trimmed = email.trim().toLowerCase();
    const invite = await InviteModel.findValidInvite(trimmed, code);
    if (!invite) return res.status(404).send("Invalid or expired invite");

    const user = await UserModel.findByEmail(trimmed);
    if (!user) return res.status(500).send("Ghost user missing");

    return res.json({ success: true, needsRegistration: !user.verified, invite } );
  }

  static async accept(req: Request, res: Response) {
    const { email, code } = req.body;

    if (!email || !code) return res.status(400).send("Missing parameters");

    const trimmed = email.trim().toLowerCase();
    const invite = await InviteModel.findValidInvite(trimmed, code);
    if (!invite) return res.status(404).send("Invalid or expired invite");

    const user = await UserModel.findByEmail(trimmed);
    if (!user) return res.status(500).send("Ghost user missing");

    await InviteModel.markAccepted(invite.id);

    if (!user.verified) {
      await UserModel.activateUser(user.id);
    }

    if (invite.role === "manager" || invite.role === "coach") {

      const existingStaff = await TeamStaffModel.findStaffEntry(invite.team_id, user.id);

      if (!existingStaff) {
        return res.status(500).send("Staff entry missing");
      }

      await TeamStaffModel.updateStaff(existingStaff.id, { status: "active" });
      return res.json({ success: true });

    } 
    
    // if just a athlete 
    await TeamRosterModel.updateAthlete(invite.team_id, user.id, { status: "active" });
    return res.json({ success: true });

  }

}
