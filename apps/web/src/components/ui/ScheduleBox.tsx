import React from "react";

interface ScheduleBoxProps {
    startHour: number;
    endHour: number;
    dayIndex: number;
    calendarStartHour?: number;
    slotHeight: number; 
}

const ScheduleBox: React.FC<ScheduleBoxProps> = ({
    startHour,
    endHour,
    dayIndex,
    calendarStartHour = 7,
    slotHeight,
}) => {
    const topOffset = (startHour - calendarStartHour) * 2 * slotHeight;
    const boxHeight = (endHour - startHour) * 2 * slotHeight;

    return (
        <div
            className="absolute left-0 right-0 bg-blue-200 bg-opacity-50 border border-blue-400 rounded-md text-xs p-1 shadow-sm"
            style={{
                top: `${topOffset}px`,
                height: `${boxHeight}px`,
            }}
            >
                <div className="font-semibold text-blue-900">Class</div>
                <div>{`${startHour}:00-${endHour}:00`}</div>
            </div>
    );
};

export default ScheduleBox;