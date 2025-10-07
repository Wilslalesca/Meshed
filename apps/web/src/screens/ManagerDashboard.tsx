import React from 'react';
import { ScheduleXCalendar, useCalendarApp } from '@schedule-x/react';
import { createViewWeek, createViewMonthGrid } from '@schedule-x/calendar';
import '@schedule-x/theme-default/dist/calendar.css';

export const ManagerDashboard: React.FC = () => {
  const calendar = useCalendarApp({
    views: [createViewWeek(), createViewMonthGrid()],
    events: [
      {
        id: 1,
        title: 'Test Event',
        start: '2025-10-01 00:00',
        end: '2025-10-01 02:00',
      },
    ],
    selectedDate: '2025-10-01',
  });

  return (
    <div style={{ height: "600px", padding: "1rem" }}>
        <h1 className="text-2xl font-bold mb-4">Manager Dashboard</h1>
      <ScheduleXCalendar calendarApp={calendar} />
    </div>
  );
};
