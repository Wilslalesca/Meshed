import { Router } from 'express';
import { success, z } from 'zod';
import { db } from '../db/schedule';
import { pool } from '../db';

const router = Router();
//psql -U user mydatabaseparsed


router.get("/", (_req, res) => {
  res.json({ message: "Schedule route is running!" });
});

router.get("/athlete/:athleteId", async (req, res) => {
    try {
        
        const athleteId = req.params.athleteId;
        if (!athleteId) return res.status(400).json({ error: "Missing athlete ID" });

        const schedule = await db.getAthleteSchedule(athleteId);
        if (!schedule || schedule.length === 0) return res.status(404).json({ message: "No schedule found for this athlete." });
        
        return res.status(200).json(schedule);

    } catch (error) {

        console.error("Error fetching athlete schedule:", error);

        return res.status(500).json({ message: "Internal server error" });
    }
});

export default router;