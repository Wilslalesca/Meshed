import { Request, Response } from "express";
import { AthleteModel } from "../models/AthleteModel";

export const AthleteController = {

    async getAthlete(req: Request, res: Response) {
        const { athleteId } = req.params;

        try {
            const athlete = await AthleteModel.getAthleteById(athleteId);

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
