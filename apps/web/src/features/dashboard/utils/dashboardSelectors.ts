import type {
    DashboardEvent,
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

        if (
            event.team?.toLowerCase().includes("test") ||
            event.source === "team"
        ) {
            console.log("WEEKLY EVENT DEBUG", {
                title: event.title,
                source: event.source,
                date: event.date,
                dayOfWeek: event.dayOfWeek,
                recurring: event.recurring,
                endDate: event.endDate,
                time: event.time,
                parsedHours: parseHoursFromRange(event.time),
                normalizedWeekday: weekday,
            });
        }

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

export function getUpcomingTableEvents(
    events: DashboardEvent[],
    todayIso: string,
): DashboardEvent[] {
    return events
        .filter((event: DashboardEvent) => {
            if (event.source === "team") return event.date >= todayIso;

            if (event.source === "schedule") {
                if (event.recurring && event.endDate) {
                    return event.endDate >= todayIso;
                }
                return event.date >= todayIso;
            }

            return false;
        })
        .sort((a: DashboardEvent, b: DashboardEvent) =>
            `${a.date} ${a.time}`.localeCompare(`${b.date} ${b.time}`),
        );
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
