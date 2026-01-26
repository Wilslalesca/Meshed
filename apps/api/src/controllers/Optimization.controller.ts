import type { Request , Response } from 'express';
import { maximizeAttendanceService } from '../services/maximizeAttendanceService';
import { dpMinimizeMissesAlgService } from '../services/dpMinimizeMissesAlgService';

export async function optimizeScheduleController(req: Request, res: Response) {
    try {
        const { optimizationType, days } = req.body as {
            optimizationType: 'MAX_ATTENDANCE' | 'MIN_MISSES',
            days: any;
        };

        if (!optimizationType || !days) return res.status(400).json({ message: 'optimizationType and days are required fields.' });
            
        if (optimizationType === "MIN_MISSES") {
            const result = dpMinimizeMissesAlgService(days);
            return res.json({ type: "MIN_MISSES", result });
        }

        if (optimizationType === "MAX_ATTENDANCE") {
            const result = maximizeAttendanceService(days);
            return res.json({ type: "MAX_ATTENDANCE", result });
        }

        return res.status(400).json({ message: "Invalid optimizationType" });
    }
    catch(err) {
        console.error("Error in optimizeScheduleController:", err);
        return res.status(500).json({ message: "Optimization failed" });
    }
}