export const API_BASE = import.meta.env.VITE_API_BASE_URL;
import type { TeamScheduleEvent, CourseTimeRow } from "../types/schedule";


function dayNameToIndex(day: string): number | null {
  const new_day = day.trim().toLowerCase(); 
  if (new_day.startsWith("mon")) return 1;
  if (new_day.startsWith("tue")) return 2;
  if (new_day.startsWith("wed")) return 3;
  if (new_day.startsWith("thu")) return 4;
  if (new_day.startsWith("fri")) return 5;
  if (new_day.startsWith("sat")) return 6;
  if (new_day.startsWith("sun")) return 0;
  return null;
}

function parseTimeToHoursMinutes(time:string) {
  const [hour, minute] = time.split(":");
  return { hour: Number(hour), minute: Number(minute) };
}

function startOfDay(day: Date) {
  const new_day = new Date(day);
  new_day.setHours(0, 0, 0, 0);
  return new_day;
}

function eachDay(fromISO: string, toISO: string): Date[] {
  const start = startOfDay(new Date(fromISO));
  const end = startOfDay(new Date(toISO));
  const days: Date[] = [];
  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    days.push(new Date(d));
  }
  return days;
}

function withinOptionalDateWindow(day: Date, row: CourseTimeRow): boolean {

  if (!row.start_date && !row.end_date) return true;
  const dayOnly = startOfDay(day).getTime();

  if (row.start_date) {
    const s = startOfDay(new Date(row.start_date)).getTime();
    if (dayOnly < s) return false;
  }
  if (row.end_date) {
    const e = startOfDay(new Date(row.end_date)).getTime();
    if (dayOnly > e) return false;
  }
  return true;
}

function buildISO(day: Date, time: string) {
  const { hour, minute } = parseTimeToHoursMinutes(time);
  const d = new Date(day);
  d.setHours(hour, minute, 0, 0);
  return d.toISOString();
}


async function apiGetAthleteScheduleRows(athleteId: string, token: string): Promise<CourseTimeRow[]> {
  const res = await fetch(`${API_BASE}/schedule/athlete/${athleteId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return res.ok ? (await res.json()) as CourseTimeRow[] : [];
}


export async function apiGetTeamSchedule( teamId: string, token: string, fromISO: string, toISO: string ) : Promise<TeamScheduleEvent[]> {

  const rosterRes = await fetch(`${API_BASE}/teams/${teamId}/athletes`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const roster = rosterRes.ok ? await rosterRes.json() : [];

  const athletes: { id: string; name: string }[] = (roster ?? []).map((a: any) => {
    const id = a.id ?? a.user_id ??  a.athleteId ?? a.athlete_id;
    const name = a.name ?? [a.first_name, a.last_name].filter(Boolean).join(" ") ?? a.email ?? "Unknown";
    return { id, name };
  }).filter((x: any) => typeof x.id === "string" && x.id.length > 0);

  const schedules = await Promise.all(
    athletes.map(async (athlete) => {
      const rows = await apiGetAthleteScheduleRows(athlete.id, token);
      return { athlete: athlete, rows };
    })
  );

  const days = eachDay(fromISO, toISO);
  const events: TeamScheduleEvent[] = [];


  for (const s of schedules) {
    for (const row of s.rows) {

      const dayIndex = dayNameToIndex(row.day_of_week);
      if (dayIndex === null) continue;

      for (const d of days) {
        if (d.getDay() !== dayIndex) continue;
        if (!withinOptionalDateWindow(d, row)) continue;

        const startTime = buildISO(d, row.start_time);
        const endTime = buildISO(d, row.end_time);

        events.push({
          id: `${s.athlete.id}:${row.id}:${startTime}`,
          athleteId: s.athlete.id,
          athleteName: s.athlete.name,
          title: row.course_code || row.name || "Class",
          location: row.location || undefined,
          startTime,
          endTime,
          type: "class",
          description: row.name || undefined,
        });
      }
    }
  }
  return events;
}


// return [
//     {
//       id: "evt-1",
//       athleteId: "a1",
//       athleteName: "Will Ross",
//       title: "ECE3232",
//       location: "Head Hall",
//       startTime: "2026-01-06T13:00:00",
//       endTime: "2026-01-06T14:30:00",
//       type: "class",
//     },
//     {
//       id: "evt-2",
//       athleteId: "a1",
//       athleteName: "Will Ross",
//       title: "ECE3232",
//       location: "Head Hall",
//       startTime: "2026-01-08T13:00:00",
//       endTime: "2026-01-08T14:30:00",
//       type: "class",
//     },
//     {
//       id: "evt-3",
//       athleteId: "a1",
//       athleteName: "Will Ross",
//       title: "ENGG4002",
//       location: "Head Hall",
//       startTime: "2026-01-06T17:30:00",
//       endTime: "2026-01-06T18:20:00",
//       type: "class",
//     },
//     {
//       id: "evt-4",
//       athleteId: "a1",
//       athleteName: "Will Ross",
//       title: "TME4025",
//       location: "Head Hall",
//       startTime: "2026-01-08T17:30:00",
//       endTime: "2026-01-08T18:20:00",
//       type: "class",
//     },
//     {
//       id: "evt-5",
//       athleteId: "a2",
//       athleteName: "Alex Cameron",
//       title: "TME4025",
//       location: "Head Hall",
//       startTime: "2026-01-08T17:30:00",
//       endTime: "2026-01-08T18:20:00",
//       type: "class",
//     },
//     {
//       id: "evt-6",
//       athleteId: "a2",
//       athleteName: "Alex Cameron",
//       title: "ENGG4002",
//       location: "Head Hall",
//       startTime: "2026-01-06T17:30:00",
//       endTime: "2026-01-06T18:20:00",
//       type: "class",
//     },
//     {
//       id: "evt-6",
//       athleteId: "a3",
//       athleteName: "Alex Cameron",
//       title: "ENGG4002",
//       location: "Head Hall",
//       startTime: "2026-01-06T17:30:00",
//       endTime: "2026-01-06T18:20:00",
//       type: "class",
//     },
//     {
//       id: "evt-6",
//       athleteId: "a4",
//       athleteName: "Alex Cameron",
//       title: "ENGG4002",
//       location: "Head Hall",
//       startTime: "2026-01-06T17:30:00",
//       endTime: "2026-01-06T18:20:00",
//       type: "class",
//     },
//     {
//       id: "evt-6",
//       athleteId: "a5",
//       athleteName: "Alex Cameron",
//       title: "ENGG4002",
//       location: "Head Hall",
//       startTime: "2026-01-06T17:30:00",
//       endTime: "2026-01-06T18:20:00",
//       type: "class",
//     },
//     {
//       id: "evt-6",
//       athleteId: "a6",
//       athleteName: "Alex Cameron",
//       title: "ENGG4002",
//       location: "Head Hall",
//       startTime: "2026-01-06T17:30:00",
//       endTime: "2026-01-06T18:20:00",
//       type: "class",
//     },
//     {
//       id: "evt-6",
//       athleteId: "a7",
//       athleteName: "Alex Cameron",
//       title: "ENGG4002",
//       location: "Head Hall",
//       startTime: "2026-01-06T17:30:00",
//       endTime: "2026-01-06T18:20:00",
//       type: "class",
//     },
//     {
//       id: "evt-6",
//       athleteId: "a8",
//       athleteName: "Alex Cameron",
//       title: "ENGG4002",
//       location: "Head Hall",
//       startTime: "2026-01-06T17:30:00",
//       endTime: "2026-01-06T18:20:00",
//       type: "class",
//     },