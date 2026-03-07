import type { OptimizationResult } from "../types/OptimizationResult"
import type { TeamScheduleEvent } from "../types/schedule"
import type { MaxAttendanceDay } from "../types/OptimizationResult";

const DAYS: Record<string, number> = {
  Sunday: 0,
  Monday: 1,
  Tuesday: 2,
  Wednesday: 3,
  Thursday: 4,
  Friday: 5,
  Saturday: 6,
};

export function getClosestPracticeDates(dayResult: MaxAttendanceDay) {
  const today = new Date();
  const targetDay = DAYS[dayResult.day];

  const currentDay = today.getDay();
  let diff = targetDay - currentDay;

  if (diff < 0) diff += 7;

  const baseDate = new Date(today);
  baseDate.setDate(today.getDate() + diff);

  const [startHour, startMinute] = dayResult.option.start.split(":").map(Number);
  const [endHour, endMinute] = dayResult.option.end.split(":").map(Number);

  const startDate = new Date(baseDate);
  startDate.setHours(startHour, startMinute, 0, 0);

  const endDate = new Date(baseDate);
  endDate.setHours(endHour, endMinute, 0, 0);

  return {
    start: startDate,
    end: endDate,
  };
}
export const useFilterOptimizedEvents = (optimizeResults: OptimizationResult|null) => {
    let filteredEvents : TeamScheduleEvent[] = []
    if (optimizeResults && optimizeResults.type == "MAX_ATTENDANCE"){
        let tempId = "0";
        optimizeResults.result.forEach((s)=>{
            const {start, end} =  getClosestPracticeDates(s)
            const misses = "Absences: " + Object.keys(s.option.athletesMissing).length;
            let event :TeamScheduleEvent= {
                id:tempId,
                athleteId:tempId,
                athleteName:misses,
                title:misses,
                name:misses,
                startTime: start,
                endTime : end,
                type: "Other",
            }
            filteredEvents.push(event)
            tempId+="0"
        })
    }
    return filteredEvents
    /**else if (optimizeResults.type == "MIN_MISSES"){
        var tempId = "0";
        optimizeResults.result.schedule.forEach((s)=>{
            var event :TeamScheduleEvent= {
                id:tempId,
                athleteId:tempId,
                athleteName:tempId,
                title:tempId,
                name:tempId,
                startTime: s.start,
                endTime : s.end,
                type: "Other",
            }
            filteredEvents.push(event)
            tempId+="0"
        })
    }**/
}