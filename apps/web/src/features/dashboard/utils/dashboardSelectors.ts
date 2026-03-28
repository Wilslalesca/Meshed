import type {
    DashboardEvent,
    UpcomingEventFilter,
    UpcomingEventRow,
    Weekday,
    WeekHoursDatum,
} from "../types/dashboard";
import {
    getEndOfWeek,
    getStartOfWeek,
    normalizeWeekday,
    parseLocalDate,
    startOfDay,
    WEEKDAYS,
} from "./date";
import { parseHoursFromRange } from "./time";

export function getUpcomingEvents(
    events: DashboardEvent[],
    todayIso: string,
): DashboardEvent[] {
    return events
        .filter((event: DashboardEvent) => event.date >= todayIso)
        .sort((a: DashboardEvent, b: DashboardEvent) =>
            `${a.date} ${a.time}`.localeCompare(`${b.date} ${b.time}`),
        );
}

export function getTodayEvents(
    events: DashboardEvent[],
    todayIso: string,
): DashboardEvent[] {
    return events.filter((event: DashboardEvent) => event.date === todayIso);
}

export function getThisWeekCount(events: DashboardEvent[]): number {
    const now = new Date();
    const next7 = new Date();
    next7.setDate(now.getDate() + 7);

    return events.filter((event: DashboardEvent) => {
        const eventDate = parseLocalDate(event.date);
        return eventDate >= now && eventDate <= next7;
    }).length;
}

export function getWeeklyHoursData(events: DashboardEvent[]): WeekHoursDatum[] {
    const totals: Record<Weekday, number> = {
        Sun: 0,
        Mon: 0,
        Tue: 0,
        Wed: 0,
        Thu: 0,
        Fri: 0,
        Sat: 0,
    };

    const now = new Date();
    const weekStart = getStartOfWeek(now);
    const weekEnd = getEndOfWeek(now);
    const seen = new Set<string>();

    for (const event of events) {
        const weekday = normalizeWeekday(event.dayOfWeek);

        if (event.recurring && weekday) {
            const key = `${event.source}-${weekday}-${event.time}-${event.title}-${event.team ?? ""}`;
            if (seen.has(key)) continue;
            seen.add(key);

            totals[weekday] += parseHoursFromRange(event.time);
            continue;
        }

        const eventDate = startOfDay(parseLocalDate(event.date));
        if (eventDate < weekStart || eventDate > weekEnd) continue;

        const key = `${event.source}-${event.date}-${event.time}-${event.title}-${event.team ?? ""}`;
        if (seen.has(key)) continue;
        seen.add(key);

        const day: Weekday = WEEKDAYS[eventDate.getDay()];
        totals[day] += parseHoursFromRange(event.time);
    }

    return WEEKDAYS.map((day: Weekday) => ({
        day,
        hours: Number(totals[day].toFixed(1)),
    }));
}

function getNextOccurrenceDate(day: Weekday): Date {
    const today = startOfDay(new Date());
    const todayIndex = today.getDay();
    const targetIndex = WEEKDAYS.indexOf(day);

    const diff = (targetIndex - todayIndex + 7) % 7;
    const next = new Date(today);
    next.setDate(today.getDate() + diff);
    return next;
}

export function getUpcomingTableEvents(
    events: DashboardEvent[],
    todayIso: string,
): DashboardEvent[] {
    const today = startOfDay(parseLocalDate(todayIso));

    return events
        .filter((event: DashboardEvent) => {
            const weekday = normalizeWeekday(event.dayOfWeek);

            if (event.recurring && weekday) {
                if (event.endDate) {
                    const endDate = startOfDay(parseLocalDate(event.endDate));
                    if (endDate < today) return false;
                }

                const nextOccurrence = getNextOccurrenceDate(weekday);
                return nextOccurrence >= today;
            }

            if (!event.date) return false;

            const eventDate = startOfDay(parseLocalDate(event.date));
            return eventDate >= today;
        })
        .sort((a: DashboardEvent, b: DashboardEvent) => {
            const aWeekday = normalizeWeekday(a.dayOfWeek);
            const bWeekday = normalizeWeekday(b.dayOfWeek);

            const aDate =
                a.recurring && aWeekday
                    ? getNextOccurrenceDate(aWeekday)
                    : startOfDay(parseLocalDate(a.date));

            const bDate =
                b.recurring && bWeekday
                    ? getNextOccurrenceDate(bWeekday)
                    : startOfDay(parseLocalDate(b.date));

            const dateDiff = aDate.getTime() - bDate.getTime();
            if (dateDiff !== 0) return dateDiff;

            return a.time.localeCompare(b.time);
        });
}

export function toUpcomingEventRows(
    events: DashboardEvent[],
): UpcomingEventRow[] {
    return events.map((event: DashboardEvent) => ({
        id: event.id,
        title: event.title,
        date: event.date,
        time: event.time,
        team: event.team ?? "—",
        location: event.location ?? "—",
        status: event.status ?? "—",
    }));
}


function getEffectiveEventDate(event: DashboardEvent): Date {
    const weekday = normalizeWeekday(event.dayOfWeek);

    if (event.recurring && weekday) {
        return getNextOccurrenceDate(weekday);
    }

    return startOfDay(parseLocalDate(event.date));
}

export function filterUpcomingTableEvents(
    events: DashboardEvent[],
    filter: UpcomingEventFilter,
): DashboardEvent[] {
    const today = startOfDay(new Date());
    const weekEnd = getEndOfWeek(today);

    if (filter === "all") {
        return events;
    }

    return events.filter((event: DashboardEvent) => {
        const eventDate = getEffectiveEventDate(event);

        if (filter === "today") {
            return eventDate.getTime() === today.getTime();
        }

        if (filter === "week") {
            return eventDate >= today && eventDate <= weekEnd;
        }

        if (filter === "schedule") {
            return event.source === "schedule";
        }

        if (filter === "team") {
            return event.source === "team";
        }

        return true;
    });
}