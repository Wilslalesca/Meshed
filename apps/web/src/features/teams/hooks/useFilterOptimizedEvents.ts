import type { OptimizationResult } from "../types/OptimizationResult"
import type { OptimizedCalendarResult } from "../types/OptimizationResult";

type DayName =
  | "Sunday"
  | "Monday"
  | "Tuesday"
  | "Wednesday"
  | "Thursday"
  | "Friday"
  | "Saturday"

const DAYS: Record<DayName, number> = {
  Sunday: 0,
  Monday: 1,
  Tuesday: 2,
  Wednesday: 3,
  Thursday: 4,
  Friday: 5,
  Saturday: 6,
};

export const useFilterOptimizedEvents = (optimizeResults: OptimizationResult|null) => {
    const filteredEvents : OptimizedCalendarResult[] = []
    if (optimizeResults && optimizeResults.type == "MAX_ATTENDANCE"){
        let tempId = 0;
        optimizeResults.result.forEach((s)=>{
            const misses = "Absences: " + Object.keys(s.option?.athletesMissing).length;
            const event :OptimizedCalendarResult= {
                id:tempId.toString(),
                title:misses,
                dayOfWeek:[DAYS[s.day as DayName]],
                startTime: s.option?.start,
                endTime : s.option?.end,
            }
            filteredEvents.push(event)
            tempId+=1
        })
        return filteredEvents
    }
    else if (optimizeResults && optimizeResults.type == "MIN_MISSES"){
        let tempId = 0;
        optimizeResults.result.schedule.forEach((s)=>{
            const misses = "Absences: " + Object.keys(s.option?.athletesMissing).length;
            const event :OptimizedCalendarResult= {
                id:tempId.toString(),
                title:misses,
                dayOfWeek:[DAYS[s.day as DayName]],
                startTime: s.option.start,
                endTime : s.option.end,
            }
            filteredEvents.push(event)
            tempId+=1
        })
        return filteredEvents
    }
}