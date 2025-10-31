import React from 'react';
import type { Schedule } from '../types/Schedule';
import { formatTime } from '../utils/formatTime';

interface Props {
    data: Schedule[];
}

export const ScheduleTable: React.FC<Props> = ({ data }) => (

    <table className="w-full text-sm border-collapse border border-gray-300 rounded-xl">
    <thead className="bg-gray-100">
      <tr>
        <th className="p-2 border">Course</th>
        <th className="p-2 border">Day</th>
        <th className="p-2 border">Time</th>
        <th className="p-2 border">Location</th>
        <th className="p-2 border">Term</th>
      </tr>
    </thead>
    <tbody>
      {data.map((c) => (
        <tr key={c.id}>
          <td className="p-2 border">{c.name}</td>
          <td className="p-2 border">{c.day_of_week}</td>
          <td className="p-2 border">
            {formatTime(c.start_time)} – {formatTime(c.end_time)}
          </td>
          <td className="p-2 border">{c.location}</td>
          <td className="p-2 border">{c.term}</td>
        </tr>
      ))}
    </tbody>
  </table>
);