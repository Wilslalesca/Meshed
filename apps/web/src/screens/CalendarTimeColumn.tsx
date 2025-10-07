import  React from 'react';

interface TimeColumnProps {
  startHour: number;
  endHour: number;
  intervalMinutes?: number;
}

const CalendarTimeColumn: React.FC<TimeColumnProps> = ({
  startHour,
  endHour,
  intervalMinutes = 30,
}) => {
  const times: string[] = [];

  for (let hour = startHour; hour < endHour; hour++) {
    for (let min = 0; min < 60; min += intervalMinutes) {
      times.push(`${hour}:${min === 0 ? "00" : min}`);
    }
  }

  return (
    <div className="w-16 border-r border-gray-300 text-xs text-gray-500">
      <div className="h-10" /> {/* top-left empty space */}
      {times.map((time, i) => (
        <div
          key={i}
          className="h-10 border-t border-gray-200 flex justify-end pr-1"
        >
          {time}
        </div>
      ))}
    </div>
  );
};

export default CalendarTimeColumn;
