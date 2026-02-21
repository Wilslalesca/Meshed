// apps/api/src/controllers/FacilityController.ts
import { Response } from "express";
import { FacilityModel } from "../models/FacilityModel";

function canManageFacilities(req: any): boolean {
  const role = req.user?.role;
  return role === "admin" || role === "manager";
}

export class FacilityController {
  static async list(req: any, res: Response) {
    if (!canManageFacilities(req)) {
      return res.status(403).send("Forbidden");
    }

    const facilities = await FacilityModel.findAll();
    return res.json(facilities);
  }

  static async create(req: any, res: Response) {
    if (!canManageFacilities(req)) {
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
