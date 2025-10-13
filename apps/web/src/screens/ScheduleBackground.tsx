import React from "react";
import CalendarTimeColumn from "./CalendarTimeColumn";

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
            <div key={day} className="flex-1 border-r border-gray-300">
                {/* Day Header */}
                <div className="h-10 flex justify-center items-center font-semibold bg-white border-b border-gray-300">
                {day}
                </div>

                {/* Time Slots */}
                {times.map((_, i) => (
                <div
                    key={i}
                    className="h-10 border-t border-gray-200 hover:bg-blue-50 transition"
                ></div>
                ))}
            </div>
            ))}
        </div>
        </div>
    );
};

export default ScheduleBackground;
