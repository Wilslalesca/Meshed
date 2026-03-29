import { Response } from "express";
import { FacilityModel } from "../models/FacilityModel";
import { Role } from "../types";
import { AuthedRequest } from "../middleware/authMiddleware";

function canManageFacilities(role: Role | undefined): boolean {
    return role === "admin" || role === "manager";
}

export class FacilityController {
    static async list(req: AuthedRequest, res: Response) {
        if (!req.user) return res.status(401).send("Unauthorized");

        if (!canManageFacilities(req.user.organizationRole)) {
        return res.status(403).send("Forbidden");
        }

        const facilities = await FacilityModel.findAll(req.user.organizationId);
        return res.json(facilities);
    }

    static async create(req: AuthedRequest, res: Response) {
        if (!req.user) return res.status(401).send("Unauthorized");
        if (!canManageFacilities(req.user.organizationRole)) return res.status(403).send("Forbidden");

        const { name } = req.body;
        if (!name || String(name).trim().length < 2) return res.status(400).send("name required");

        const facility = await FacilityModel.create(
        {
            ...req.body,
            name: String(name).trim(),
        },
            req.user.organizationId
        );

        return res.status(201).json(facility);
    }
}