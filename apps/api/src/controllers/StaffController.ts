import { Request, Response } from "express";
import { TeamStaffModel } from "../models/TeamStaffModel";
import { UserModel } from "../models/UserModel";
import { TeamModel } from "../models/TeamModel";

function isManagerOrAdmin(req: any) {
  const role = req.user?.role;
  return role === "manager" || role === "admin";
}

export class StaffController {
  static async getStaff(req: Request, res: Response) {
    const { teamId } = req.params;
    const staff = await TeamStaffModel.getStaff(teamId);
    return res.json(staff);
  }

  static async addStaff(req: any, res: Response) {
    if (!isManagerOrAdmin(req))
      return res.status(403).send("Forbidden");

    const { teamId } = req.params;
    const { email, role, notes = null } = req.body || {};

    if (!email) return res.status(400).send("email required");

    let user = await UserModel.findByEmail(email);
    if (!user || user.id === null) {
      user = await UserModel.createGhostUser(email);
    }

    if (!user || user.id === null) {
      return res.status(500).send("Failed to find or create user");
    }

    const added = await TeamStaffModel.addStaff(teamId, user.id, role, notes);
    return res.json(added);
  }

  static async updateStaff(req: any, res: Response) {
    if (!isManagerOrAdmin(req))
      return res.status(403).send("Forbidden");

    const { staffId } = req.params;
    const updated = await TeamStaffModel.updateStaff(staffId, req.body);
    if (!updated) return res.status(404).send("not found");

    return res.json(updated);
  }

  static async removeStaff(req: any, res: Response) {
    if (!isManagerOrAdmin(req))
      return res.status(403).send("Forbidden");

    const { staffId } = req.params;
    await TeamStaffModel.removeStaff(staffId);
    return res.json({ success: true });
  }
}
