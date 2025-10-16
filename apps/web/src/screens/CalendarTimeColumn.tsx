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
    <div className="w-16 border-r border-gray-300 text-xs text-gray-500 flex flex-col">
      <div className="h-12 border-t border-b border-gray-300 bg-white" /> 
      {times.map((time, i) => (
        <div
          key={i}
          className="h-12 border-t border-gray-200 flex justify-end pr-1 items-start"
        >
          {time}
        </div>
      ))}
    </div>
  );
};

export default CalendarTimeColumn;
