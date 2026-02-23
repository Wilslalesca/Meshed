import { ScheduleModel } from "../models/ScheduleModel";
import type { OptimizationDay, TimeOption, TimeRange } from "../types/optimization";

function toMinutes(time: string): number | null {
    const parts = time.split(":").map((p) => Number(p));
    if (parts.length < 2 || parts.some((p) => Number.isNaN(p))) return null;
    return parts[0] * 60 + parts[1];
}

function rangesOverlap(a: TimeRange, b: TimeRange): boolean {
    const aStart = toMinutes(a.start);
    const aEnd = toMinutes(a.end);
    const bStart = toMinutes(b.start);
    const bEnd = toMinutes(b.end);

    if (aStart === null || aEnd === null || bStart === null || bEnd === null) return false;
    if (aEnd <= aStart || bEnd <= bStart) return false;

    return aStart < bEnd && bStart < aEnd;
}

export async function buildDaysWithAthleteMisses(teamId: string, days: OptimizationDay[]) {
    const schedules = await ScheduleModel.getTeamAthleteSchedules(teamId);
    const schedulesByDay = new Map<string, Map<string, TimeRange[]>>();

    for (const row of schedules) {
        if (!row.day_of_week || !row.start_time || !row.end_time) continue;
        const dayKey = row.day_of_week;
        const athleteId = row.athlete_id;

        if (!schedulesByDay.has(dayKey)) {
            schedulesByDay.set(dayKey, new Map());
        }
        const dayMap = schedulesByDay.get(dayKey)!;
        if (!dayMap.has(athleteId)) {
            dayMap.set(athleteId, []);
        }
        dayMap.get(athleteId)!.push({
            start: row.start_time,
            end: row.end_time,
        });
    }

    return days.map((day) => {
        const dayMap = schedulesByDay.get(day.day) ?? new Map<string, TimeRange[]>();
        const options = day.options.map((option) => {
            const athleteMisses: Record<string, number> = {};

            for (const [athleteId, ranges] of dayMap.entries()) {
                if (ranges.some((range) => rangesOverlap(option, range))) {
                    athleteMisses[athleteId] = 1;
                }
            }

            return {
                ...option,
                athletesMissing: athleteMisses,
            };
        });

        return {
            ...day,
            options,
        };
    });
}
