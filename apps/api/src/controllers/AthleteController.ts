import { Response } from "express";
import { AthleteModel } from "../models/AthleteModel";
import { AuthedRequest } from "../middleware/authMiddleware";

export const AthleteController = {

    async getAthlete(req: AuthedRequest, res: Response) {
        if (!req.user) return res.status(401).json({ error: "Unauthorized" });
        const { athleteId } = req.params;

        try {
            const athlete = await AthleteModel.getAthleteById(athleteId, req.user.organizationId);

            if (!athlete) {
                return res.status(404).json({ error: "Athlete not found" });
            }

            return res.json(athlete);
        } catch (err) {
            console.error("GET /athletes/:id error:", err);
            return res.status(500).json({ error: "Server error" });
        }
    },
};
