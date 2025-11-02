import React, { useEffect, useState } from "react";
import CalendarTimeColumn from "./CalendarTimeColumn";
import DayColumn from "./DayColumn";
import { fetchCourseTimes } from "@/api/courses";
import type { CourseTime } from "@/types/courses";

interface ScheduleBackgroundProps {
    startHour?: number;
    endHour?: number;
}
const ScheduleBackground: React.FC<ScheduleBackgroundProps> = ({
    startHour = 7,
    endHour = 22,
}) => {
    const days: string[] = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

    // Generate 30-min time slots (needed for day columns)
    const intervalMinutes = 30;
    const times: string[] = [];
    for (let hour = startHour; hour < endHour; hour++) {
        for (let min = 0; min < 60; min += intervalMinutes) {
        times.push(`${hour}:${min === 0 ? "00" : min}`);
        }
    }

    const [courseTimes, setCourseTimes] = useState<CourseTime[]>([]);

    useEffect(() => {
      let mounted = true;
      fetchCourseTimes()
        .then((rows) => {
          if (!mounted) return;
          setCourseTimes(rows);
        })
        .catch((err) => {
          console.error("Failed to fetch course times", err);
        });
      return () => { mounted = false; };
    }, []);

    // helper: parse "9:00 AM" -> decimal hours (9 or 9.5)
    const parseTimeToDecimal = (t: string) => {
      const m = t.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
      if (!m) return 0;
      let h = parseInt(m[1], 10);
      const min = parseInt(m[2], 10);
      const ampm = m[3].toUpperCase();
      if (ampm === "PM" && h !== 12) h += 12;
      if (ampm === "AM" && h === 12) h = 0;
      return h + min / 60;
    };

    // Build per-day events
    const eventsByDay: Record<string, { start:number; end:number; title?:string }[]> = {};
    courseTimes.forEach(ct => {
      const dayKey = (ct.day_of_week ?? "").slice(0,3); // "Mon", "Tue", ...
      const start = parseTimeToDecimal(ct.start_time ?? "0:00 AM"); //May end up with issues in time formates
      const end = parseTimeToDecimal(ct.end_time ?? "0:00 AM");
      if (!eventsByDay[dayKey]) eventsByDay[dayKey] = [];
      eventsByDay[dayKey].push({ start, end, title: ct.name });
    });

    return (
        <div className="flex h-screen bg-gray-50 font-sans">
        {/* Time Column */}
        <CalendarTimeColumn startHour={startHour} endHour={endHour} intervalMinutes={intervalMinutes} />
        {/* Day Columns */}
        <div className="flex flex-1">
            {days.map((day) => (
                <DayColumn
                    key={day}
                    startHour={startHour}
                    endHour={endHour}
                    day={day}
                    intervalMinutes={intervalMinutes}
                    events={eventsByDay[day] ?? []}
                />
            ))}
        </div>
        </div>
    );
};

export default ScheduleBackground;