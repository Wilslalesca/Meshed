import type { Request , Response } from 'express';
import { maximizeAttendanceService } from '../services/maximizeAttendanceService';
import { dpMinimizeMissesAlgService } from '../services/dpMinimizeMissesAlgService';
import { buildDaysWithAthleteMisses } from '../services/optimizationService';
import type { OptimizationDay } from '../types/optimization';


export async function optimizeScheduleController(req: Request, res: Response) {
    try {
        const { optimizationType, days, teamId } = req.body as {
            optimizationType: 'MAX_ATTENDANCE' | 'MIN_MISSES',
            days: OptimizationDay[];
            teamId?: string;
        };

        if (!optimizationType || !days || !teamId) {
            return res.status(400).json({ message: 'optimizationType, days, and teamId are required fields.' });
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
    }
    catch(err) {
        console.error("Error in optimizeScheduleController:", err);
        return res.status(500).json({ message: "Optimization failed" });
    }
}