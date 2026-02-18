import { Request, Response } from "express";
import { ScheduleService } from "../services/scheduleService";

export const ScheduleController = {
  async health(_req: Request, res: Response) {
    res.json({ message: "Schedule route is running!" });
  },

  async getAthleteSchedule(req: Request, res: Response) {
    try {
      const athleteId = Array.isArray(req.params.athleteId) ? req.params.athleteId[0] : req.params.athleteId;
      if (!athleteId) return res.status(400).json({ error: "Missing athlete ID" });

      const schedule = await ScheduleService.getScheduleForAthlete(athleteId);
      return res.status(200).json(schedule);
    } catch (err) {
      console.error("Error fetching athlete schedule:", err);
      return res.status(500).json({ message: "Internal server error" });
    }
  },
};
