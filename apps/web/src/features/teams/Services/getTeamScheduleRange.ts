import type { CourseTimeRow, TeamEventRow, TeamScheduleEvent } from "../types/schedule";


function toDateOnly(dateStr: string) {
    return dateStr.includes("T") ? dateStr.split("T")[0] : dateStr;
}

function toISO(dateStr: string, timeStr: string) {
    const [y, m, d] = toDateOnly(dateStr).split("-").map(Number);
    const [hh, mm] = timeStr.split(":").map(Number);
    const dt = new Date(y, m - 1, d, hh, mm, 0, 0);
    return dt.toISOString();
}


function startOfDay(day: Date) {
    const d = new Date(day);
    d.setHours(0, 0, 0, 0);
    return d;
}

function eachDay(fromISO: string, toISODate: string): Date[] {
    const start = startOfDay(new Date(fromISO));
    const end = startOfDay(new Date(toISODate));
    const out: Date[] = [];
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
        out.push(new Date(d));
    }
    return out;
}

function dayNameToIndex(day?: string | null): number | null {
    if (!day) return null;
    const s = day.trim().toLowerCase();
    if (s.startsWith("sun")) return 0;
    if (s.startsWith("mon")) return 1;
    if (s.startsWith("tue")) return 2;
    if (s.startsWith("wed")) return 3;
    if (s.startsWith("thu")) return 4;
    if (s.startsWith("fri")) return 5;
    if (s.startsWith("sat")) return 6;
    return null;
}

function withinWindow(day: Date, start?: string | null, end?: string | null) {
    const dayT = startOfDay(day).getTime();
    if (start) {
        const s = startOfDay(new Date(toDateOnly(start))).getTime();
        if (dayT < s) return false;
    }
    if (end) {
        const e = startOfDay(new Date(toDateOnly(end))).getTime();
        if (dayT > e) return false;
    }
    return true;
}

export function mapTeamEventRowsToScheduleEvents(
  rows: TeamEventRow[],
  fromISO: string,
  toISODate: string
): TeamScheduleEvent[] {
  const days = eachDay(fromISO, toISODate);
  const events: TeamScheduleEvent[] = [];

  for (const r of rows) {
    if (!r.reoccurring) {
      const startTime = toISO(r.start_date, r.start_time);
      const endTime = toISO(r.start_date, r.end_time);

      events.push({
        id: `team:${r.id}:${startTime}`,
        athleteId: "team",
        athleteName: "Team",
        title: r.type,
        location: r.home_away ?? undefined,
        startTime,
        endTime,
        type: "team_event",
        description: r.notes ?? undefined,
      });

      continue;
    }

    const dow = dayNameToIndex(r.day_of_week);
    if (dow === null) continue;

    const recType = (r.reoccurr_type ?? "weekly").toLowerCase();
    if (recType !== "weekly") continue;

    for (const d of days) {
      if (d.getDay() !== dow) continue;
      if (!withinWindow(d, r.start_date, r.end_date ?? null)) continue;

      const dateStr = d.toISOString();
      const startTime = toISO(dateStr, r.start_time);
      const endTime = toISO(dateStr, r.end_time);

      events.push({
        id: `team:${r.id}:${startTime}`,
        athleteId: "team",
        athleteName: "Team",
        title: r.type,
        location: r.home_away ?? undefined,
        startTime,
        endTime,
        type: "team_event",
        description: r.notes ?? undefined,
      });
    }
  }

  events.sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());
  return events;
}

export function mapCourseRowsToScheduleEvents( athlete: {id: string, name: string}, rows: CourseTimeRow[], fromISO: string, toISODate: string ): TeamScheduleEvent[] {
    const days = eachDay(fromISO, toISODate);
    const events: TeamScheduleEvent[] = [];

    for (const row of rows) {
        const dayOfWeek = dayNameToIndex(row.day_of_week);
        if (dayOfWeek === null) continue;

        if (!row.recurring) {
            const firstMatch = days.find(
                (d) =>
                    d.getDay() === dayOfWeek &&
                    withinWindow(d, row.start_date ?? null, row.end_date ?? null)
            );
            if (!firstMatch) continue;

            const dateString = firstMatch.toISOString();
            const startTime = toISO(dateString, row.start_time);
            const endTime = toISO(dateString, row.end_time);

            events.push({
                id: `${athlete.id}:${row.id}:${startTime}`,
                athleteId: athlete.id,
                athleteName: athlete.name,
                title: row.course_code || row.name || "Class",
                location: row.location || undefined,
                startTime,
                endTime,
                type: "class",
                description: row.name || undefined,
            });

            continue;
        }

        for (const d of days) {
            if (d.getDay() !== dayOfWeek) continue;
            if (!withinWindow(d, row.start_date ?? null, row.end_date ?? null)) continue;

            const dateString = d.toISOString();
            const startTime = toISO(dateString, row.start_time);
            const endTime = toISO(dateString, row.end_time);

            events.push({
                id: `${athlete.id}:${row.id}:${startTime}`,
                athleteId: athlete.id,
                athleteName: athlete.name,
                title: row.course_code || row.name || "Class",
                location: row.location || undefined,
                startTime,
                endTime,
                type: "class",
                description: row.name || undefined,
            });
        }
    }
    return events;
}