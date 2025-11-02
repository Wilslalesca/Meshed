import React from "react";

interface ScheduleBoxProps {
    start: number; // decimal hours, e.g. 9.5 for 9:30
    end: number;   // decimal hours
    dayIndex: number;
    calendarStartHour?: number;
    slotHeight: number; 
}

const ScheduleBox: React.FC<ScheduleBoxProps> = ({
    start,
    end,
    dayIndex,
    calendarStartHour = 7,
    slotHeight,
}) => {
    const topOffset = (start - calendarStartHour) * 2 * slotHeight;
    const boxHeight = (end - start) * 2 * slotHeight;

    return (
        <div
            className="absolute left-0 right-0 bg-blue-200 bg-opacity-50 border border-blue-400 rounded-md text-xs p-1 shadow-sm"
            style={{
                top: `${topOffset}px`,
                height: `${boxHeight}px`,
            }}
            >
            <div className="font-semibold text-blue-900">Class</div>
            <div>{`${Math.floor(start)}:${String(Math.round((start%1)*60)).padStart(2,'0')} - ${Math.floor(end)}:${String(Math.round((end%1)*60)).padStart(2,'0')}`}</div>
        </div>
    );
};

export default ScheduleBox;