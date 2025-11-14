import React from "react";

interface DayColumnProps {
    startHour: number,
    endHour: number,
    day: string,
    intervalMinutes?: number,
}
const DayColumn: React.FC<DayColumnProps> = ({
    startHour,
    endHour,
    day,
    intervalMinutes = 30,
}) => {
    const cols: string[] = [];

    for (let hour = startHour; hour < endHour; hour++) {
        for (let min = 0; min < 60; min += intervalMinutes) {
        cols.push(`${hour}:${min === 0 ? "00" : min}`);
        }
    }

    return (
        <div className="flex flex-col flex-1 border-r border-gray-300">
        <div className="h-12 flex justify-center items-center font-semibold bg-white border-b border-gray-300">
            {day}
        </div>
           {cols.map((_, i) => (
            <div
                key={i}
                className="h-12 border-t border-gray-200 hover:bg-blue-50 transition"
            > </div>
            ))}
        </div>
    );
};

export default DayColumn;
