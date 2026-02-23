import { Response, Request } from "express";
import { FacilityModel } from "../models/FacilityModel";
import { User } from "../types";
import { UserModel } from "../models/UserModel";

function canManageFacilities(req: User): boolean {
  const role = req.role;
  return role === "admin" || role === "manager";
}

export class FacilityController {
  static async list(req: Request, res: Response) {
    const { userId } = req.params;

    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).send("User not found");
    }

    if (!canManageFacilities(user)) {
      return res.status(403).send("Forbidden");
    }

    const facilities = await FacilityModel.findAll();
    return res.json(facilities);
  }

  static async create(req: Request, res: Response) {
    const { userId } = req.params;

    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).send("User not found");
    }
    if (!canManageFacilities(user)) {
      return res.status(403).send("Forbidden");
    }

    const { name } = req.body;
    if (!name || String(name).trim().length < 2) {
      return res.status(400).send("name required");
    }

    const facility = await FacilityModel.create({
      ...req.body,
      name: String(name).trim(),
    });

    return res.status(201).json(facility);
  }
}
