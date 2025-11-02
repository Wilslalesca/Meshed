import React from "react";
import ScheduleBox from "@/components/ui/ScheduleBox";

interface DayColumnProps {
    startHour: number,
    endHour: number,
    day: string,
    intervalMinutes?: number,
    events?: { start: number; end: number; title?: string }[]
}

const DayColumn: React.FC<DayColumnProps> = ({
    startHour,
    endHour,
    day,
    intervalMinutes = 30,
    events = [],
}) => {
    const cols: string[] = [];

    for (let hour = startHour; hour < endHour; hour++) {
        for (let min = 0; min < 60; min += intervalMinutes) {
        cols.push(`${hour}:${min === 0 ? "00" : min}`);
        }
    }

    const SLOT_HEIGHT = 48; // px - matches .h-12 (3rem) if root font-size 16px

    return (
        <div className="flex flex-col flex-1 border-r border-gray-300 relative">
        <div className="h-12 flex justify-center items-center font-semibold bg-white border-b border-gray-300">
            {day}
        </div>
           {cols.map((_, i) => (
            <div
                key={i}
                className="h-12 border-t border-gray-200 hover:bg-blue-50 transition"
            > </div>
            ))}
        {/* render events as absolutely positioned boxes within this day's column */}
        {events.map((ev, i) => (
            <ScheduleBox
                key={i}
                start={ev.start}
                end={ev.end}
                dayIndex={0}
                calendarStartHour={startHour}
                slotHeight={SLOT_HEIGHT}
            />
        ))}
        </div>
    );
};

export default DayColumn;
