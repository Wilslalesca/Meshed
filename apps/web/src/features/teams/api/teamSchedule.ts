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

function isReaccuring(row: CourseTimeRow): CourseTimeRow[] {
  let events = [];

  // it will always have at least one occurrence
  let numOfWeeks = 1;

  // make sure we have both a start and end date
  if (row.start_date && row.end_date) {

    // we need to parse it from the DB its storaged and moved as a string
    const start = new Date(row.start_date);
    const end = new Date(row.end_date);

    // get the difference in time 
    const diffTime = Math.abs(end.getTime() - start.getTime());
    numOfWeeks = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 7));
  }

  for (let i = 0; i < numOfWeeks; i++) {
    // push the number of occurrences but after will have to add 7 days for a new week
    events.push(row);
    if ( i < numOfWeeks -1 ) {

      const newStart = new Date(row.start_date!); 
      newStart.setDate( newStart.getDate() + 7 ); 
      row.start_date = newStart.toISOString().split('T')[0];
      

    }
  }

  return events;
}




async function apiGetAthleteScheduleRows(athleteId: string, token: string): Promise<CourseTimeRow[]> {
  const res = await fetch(`${API_BASE}/schedule/athlete/${athleteId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return res.ok ? (await res.json()) as CourseTimeRow[] : [];
}

async function apiGetAtheletesSchedules(teamId: string, token: string): Promise<Record<string, CourseTimeRow[]>> {
  const rosterRes = await fetch(`${API_BASE}/teams/${teamId}/athletes`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const roster = rosterRes.ok ? await rosterRes.json() : [];

  const athletes: { id: string }[] = (roster ?? []).map((a: any) => {
    const id = a.id ?? a.user_id ??  a.athleteId ?? a.athlete_id;
    return { id };
  }).filter((x: any) => typeof x.id === "string" && x.id.length > 0);

  const schedules: Record<string, CourseTimeRow[]> = {};
  await Promise.all(
    athletes.map(async (athlete) => {
      const rows = await apiGetAthleteScheduleRows(athlete.id, token);
      schedules[athlete.id] = rows;
    })
  );

  return schedules;
}


// async function apiGetAthleteScheduleRows(
//   athleteId: string,
//   token: string
// ): Promise<CourseTimeRow[]> {
//   const res = await fetch(`${API_BASE}/schedule/athlete/${athleteId}`, {
//     headers: { Authorization: `Bearer ${token}` },
//   });

//   if (!res.ok) {
//     console.error("❌ Failed to fetch schedule rows for athlete:", athleteId);
//     return [];
//   }

//   const data = (await res.json()) as CourseTimeRow[];

//   console.group(`📦 Schedule rows for athlete ${athleteId}`);
//   console.table(data);
//   console.groupEnd();

//   return data;
// }



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

      let recurrences: CourseTimeRow[] = [];

      if (row.recurring) {
        for (const r of isReaccuring(row)) {
          recurrences.push(r);
        }
      }

      const dayIndex = dayNameToIndex(row.day_of_week);
      if (dayIndex === null) continue;
      if (!row.recurring) {
        const firstMatch = days.find(
          (d) =>
            d.getDay() === dayIndex &&
            withinOptionalDateWindow(d, row)
        );

        if (firstMatch) {
          const startTime = buildISO(firstMatch, row.start_time);
          const endTime = buildISO(firstMatch, row.end_time);

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

        continue;
      }

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
