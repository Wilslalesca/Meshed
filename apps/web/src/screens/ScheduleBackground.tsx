import React from "react";
import CalendarTimeColumn from "./CalendarTimeColumn";
import DayColumn from "./DayColumn";

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
                />
            ))}
        </div>
        </div>
    );
};

export default ScheduleBackground;