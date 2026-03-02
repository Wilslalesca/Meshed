import { Response } from "express";
import { FacilityModel } from "../models/FacilityModel";
import { Role } from "../types";
import { UserModel } from "../models/UserModel";
import { AuthedRequest } from "../middleware/authMiddleware";

function canManageFacilities(role: Role | undefined): boolean {
    return role === "admin" || role === "manager";
}

export class FacilityController {
    static async list(req: AuthedRequest, res: Response) {
        const userId = req.user?.id;
        if (!userId) return res.status(401).send("Unauthorized");

        const user = await UserModel.findById(userId);
        if (!user) {
            return res.status(404).send("User not found");
        }

        if (!canManageFacilities(user.role)) {
            return res.status(403).send("Forbidden");
        }

        const facilities = await FacilityModel.findAll();
        return res.json(facilities);
    }

    static async create(req: AuthedRequest, res: Response) {
        const userId = req.user?.id;
        if (!userId) return res.status(401).send("Unauthorized");

        const user = await UserModel.findById(userId);
        if (!user) {
            return res.status(404).send("User not found");
        }
        if (!canManageFacilities(user.role)) {
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
