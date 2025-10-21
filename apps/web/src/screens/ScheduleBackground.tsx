import React from "react";
import CalendarTimeColumn from "./CalendarTimeColumn";
import DayColumn from "./DayColumn";
import type { CalendarEvent } from "@/types/CalendarTypes";
import ScheduleBox from "../components/ui/ScheduleBox";


interface ScheduleBackgroundProps {
    startHour?: number;
    endHour?: number;
    events?: CalendarEvent[];
    dayIndex?: number;
}
const ScheduleBackground: React.FC<ScheduleBackgroundProps> = ({
    startHour = 7,
    endHour = 22,
    events = [],
}) => {
    const days: string[] = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

    // Generate 30-min time slots (needed for day columns)
    const intervalMinutes = 30;

    return (
        <div className="flex h-screen bg-gray-50 font-sans relative">
        {/* Time Column */}
        <CalendarTimeColumn startHour={startHour} endHour={endHour} intervalMinutes={intervalMinutes} />

        {/* Day Columns */}
        <div className="flex flex-1">
            {days.map((day, dayIndex) => (
                <div key={day} className="flex-1 relative border-r border-gray-300">
                <DayColumn
                    
                    startHour={startHour}
                    endHour={endHour}
                    day={day}
                    intervalMinutes={intervalMinutes}
                />
                {events.filter((cls) =>cls.dayIndex === dayIndex).map((cls) => (
                    <ScheduleBox
                        key={cls.id}
                        startHour={cls.startHour}
                        endHour={cls.endHour}
                        dayIndex={dayIndex}
                        calendarStartHour={startHour}
                        slotHeight={24} // Each 30-min slot is 24px high
                    />
                ))}
            </div>

            ))}
        </div>
        </div>
    );
};

export default ScheduleBackground;