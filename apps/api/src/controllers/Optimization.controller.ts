import type { Response } from "express";
import { AuthedRequest } from "../middleware/authMiddleware";
import { TeamModel } from "../models/TeamModel";
import { maximizeAttendanceService } from "../services/maximizeAttendanceService";
import { dpMinimizeMissesAlgService } from "../services/dpMinimizeMissesAlgService";
import { buildDaysWithAthleteMisses } from "../services/optimizationService";
import type { OptimizationDay } from "../types/optimization";

export async function optimizeScheduleController(req: AuthedRequest, res: Response) {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const { optimizationType, days, teamId } = req.body as {
            optimizationType: "MAX_ATTENDANCE" | "MIN_MISSES";
            days: OptimizationDay[];
            teamId?: string;
        };

        if (!optimizationType || !days || !teamId) {
            return res.status(400).json({
                message: "optimizationType, days, and teamId are required fields.",
            });
        }

        const team = await TeamModel.getTeam(teamId, req.user.organizationId);
        if (!team) {
            return res.status(404).json({ message: "Team not found" });
        }

        const daysWithMisses = await buildDaysWithAthleteMisses(teamId, days);

        if (optimizationType === "MIN_MISSES") {
            const result = dpMinimizeMissesAlgService(daysWithMisses);
            return res.json({ type: "MIN_MISSES", result });
        }

        if (optimizationType === "MAX_ATTENDANCE") {
            const result = maximizeAttendanceService(daysWithMisses);
            return res.json({ type: "MAX_ATTENDANCE", result });
        }

        return res.status(400).json({ message: "Invalid optimizationType" });
    } catch (err) {
        console.error("Error in optimizeScheduleController:", err);
        return res.status(500).json({ message: "Optimization failed" });
    }
}