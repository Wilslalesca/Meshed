export const API_BASE = import.meta.env.VITE_API_BASE_URL;
import type { TeamScheduleEvent } from "../types/schedule";

export async function apiGetTeamSchedule( teamId: string, token: string, fromISO: string, toISO: string ) : Promise<TeamScheduleEvent[]> {
    // TODO


  return [
    {
      id: "evt-1",
      athleteId: "a1",
      athleteName: "Will Ross",
      title: "ECE3232",
      location: "Head Hall",
      startTime: "2026-01-06T13:00:00",
      endTime: "2026-01-06T14:30:00",
      type: "class",
    },
    {
      id: "evt-2",
      athleteId: "a1",
      athleteName: "Will Ross",
      title: "ECE3232",
      location: "Head Hall",
      startTime: "2026-01-08T13:00:00",
      endTime: "2026-01-08T14:30:00",
      type: "class",
    },
    {
      id: "evt-3",
      athleteId: "a1",
      athleteName: "Will Ross",
      title: "ENGG4002",
      location: "Head Hall",
      startTime: "2026-01-06T17:30:00",
      endTime: "2026-01-06T18:20:00",
      type: "class",
    },
    {
      id: "evt-4",
      athleteId: "a1",
      athleteName: "Will Ross",
      title: "TME4025",
      location: "Head Hall",
      startTime: "2026-01-08T17:30:00",
      endTime: "2026-01-08T18:20:00",
      type: "class",
    },
  ];
}