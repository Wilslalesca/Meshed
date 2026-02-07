import type { TeamEventType } from "../types/event";
import type { CourseTimeRow, TeamEventRow, TeamScheduleEvent } from "../types/schedule";


function isValidDate(d: Date) {
  return !Number.isNaN(d.getTime());
}

function parseDateOnlyLocal(dateStr: string): Date {
  const [y, m, d] = dateStr.split("-").map(Number);
  return new Date(y, (m ?? 1) - 1, d ?? 1, 0, 0, 0, 0);
}

function asLocalDate(value: unknown): Date {
  if (value instanceof Date) return value;

  if (typeof value === "string") {
    const s = value.trim();

    if (/^\d{4}-\d{2}-\d{2}$/.test(s)) {
      return parseDateOnlyLocal(s);
    }
    const d = new Date(s);
    return d;
  }

  return new Date(String(value));
}

function parseTimeParts(value: unknown): { hh: number; mm: number; ss: number } {

    if (value instanceof Date) {
    return { hh: value.getHours(), mm: value.getMinutes(), ss: value.getSeconds() };
  }

  if (typeof value === "string") {
    const s = value.trim();
    const m = s.match(/^(\d{1,2}):(\d{2})(?::(\d{2}))?$/);
    if (m) {
      const hh = Number(m[1]);
      const mm = Number(m[2]);
      const ss = Number(m[3] ?? 0);
      return { hh, mm, ss };
    }

    const d = new Date(s);
    if (isValidDate(d)) {
      return { hh: d.getHours(), mm: d.getMinutes(), ss: d.getSeconds() };
    }
  }

  const d = asLocalDate(value);
  if (isValidDate(d)) {
    return { hh: d.getHours(), mm: d.getMinutes(), ss: d.getSeconds() };
  }

  return { hh: 0, mm: 0, ss: 0 };
}

function combineLocalDateTime(dateValue: unknown, timeValue: unknown): Date {
  const date = asLocalDate(dateValue);
  const t = parseTimeParts(timeValue);

  const out = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    t.hh,
    t.mm,
    t.ss,
    0
  );

  return out;
}

function startOfDay(day: Date) {
  const d = new Date(day);
  d.setHours(0, 0, 0, 0);
  return d;
}

function addDays(day: Date, n: number) {
  const d = new Date(day);
  d.setDate(d.getDate() + n);
  return d;
}

function eachDay(fromISO: string, toISO: string): Date[] {
  const start = startOfDay(new Date(fromISO));
  const toExclusive = new Date(toISO);
  const end = startOfDay(new Date(toExclusive.getTime() - 1));

  const out: Date[] = [];
  for (let d = new Date(start); d <= end; d = addDays(d, 1)) {
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

function withinWindow(day: Date, start?: unknown | null, end?: unknown | null) {
  const dayT = startOfDay(day).getTime();

  if (start) {
    const sDate = asLocalDate(start);
    if (!isValidDate(sDate)) return false;
    const s = startOfDay(sDate).getTime();
    if (dayT < s) return false;
  }

  if (end) {
    const eDate = asLocalDate(end);
    if (!isValidDate(eDate)) return false;
    const e = startOfDay(eDate).getTime();
    if (dayT > e) return false;
  }

  return true;
}


export function mapTeamEventRowsToScheduleEvents(
  rows: TeamEventRow[],
  _fromISO: string,
  _toISO: string
): TeamScheduleEvent[] {
  const events: TeamScheduleEvent[] = [];

  for (const r of rows) {
    const startTime = combineLocalDateTime(r.start_date, r.start_time);
    let endTime = combineLocalDateTime(r.start_date, r.end_time);

    if (!isValidDate(startTime) || !isValidDate(endTime)) continue;
    

    if (endTime <= startTime) endTime = addDays(endTime, 1);

    events.push({
      id: `team:${r.id}:${startTime.toISOString()}`,
      athleteId: "team",
      athleteName: "Team",
      title: r.name ?? r.type ?? "Team Event",
      name: r.name ?? String(r.type ?? "Team Event"),
      location: r.home_away ?? undefined,
      startTime,
      endTime,
      type: r.type as TeamEventType,
      description: r.notes ?? undefined,
    });
  }

  events.sort((a, b) => a.startTime.getTime() - b.startTime.getTime());
  return events;
}

export function mapCourseRowsToScheduleEvents(
  athlete: { id: string; name: string },
  rows: CourseTimeRow[],
  fromISO: string,
  toISO: string
): TeamScheduleEvent[] {
  const days = eachDay(fromISO, toISO);
  const events: TeamScheduleEvent[] = [];

  for (const row of rows) {
    const dayOfWeek = dayNameToIndex(row.day_of_week);
    if (dayOfWeek === null) continue;

    const timeStart = parseTimeParts(row.start_time);
    const timeEnd = parseTimeParts(row.end_time);

    if (!row.recurring) {
      const firstMatch = days.find(
        (d) =>
          d.getDay() === dayOfWeek &&
          withinWindow(d, row.start_date ?? null, row.end_date ?? null)
      );
      if (!firstMatch) continue;

      const startTime = new Date(
        firstMatch.getFullYear(),
        firstMatch.getMonth(),
        firstMatch.getDate(),
        timeStart.hh,
        timeStart.mm,
        timeStart.ss,
        0
      );

      let endTime = new Date(
        firstMatch.getFullYear(),
        firstMatch.getMonth(),
        firstMatch.getDate(),
        timeEnd.hh,
        timeEnd.mm,
        timeEnd.ss,
        0
      );

      if (endTime <= startTime) endTime = addDays(endTime, 1);

      events.push({
        id: `${athlete.id}:${row.id}:${startTime.toISOString()}`,
        athleteId: athlete.id,
        athleteName: athlete.name,
        title: row.course_code || row.name || "Class",
        name: "Class",
        location: row.location || undefined,
        startTime,
        endTime,
        type: "Class" as TeamEventType,
        description: row.name || undefined,
      });

      continue;
    }

    for (const d of days) {
      if (d.getDay() !== dayOfWeek) continue;
      if (!withinWindow(d, row.start_date ?? null, row.end_date ?? null)) continue;

      const startTime = new Date(
        d.getFullYear(),
        d.getMonth(),
        d.getDate(),
        timeStart.hh,
        timeStart.mm,
        timeStart.ss,
        0
      );

      let endTime = new Date(
        d.getFullYear(),
        d.getMonth(),
        d.getDate(),
        timeEnd.hh,
        timeEnd.mm,
        timeEnd.ss,
        0
      );

      if (endTime <= startTime) endTime = addDays(endTime, 1);

      events.push({
        id: `${athlete.id}:${row.id}:${startTime.toISOString()}`,
        athleteId: athlete.id,
        athleteName: athlete.name,
        title: row.course_code || row.name || "Class",
        name: "Class",
        location: row.location || undefined,
        startTime,
        endTime,
        type: "Class" as TeamEventType,
        description: row.name || undefined,
      });
    }
  }

  return events;
}
