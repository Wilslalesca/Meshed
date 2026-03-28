import type { Weekday } from "../types/dashboard";

export const WEEKDAYS: Weekday[] = [
    "Sun",
    "Mon",
    "Tue",
    "Wed",
    "Thu",
    "Fri",
    "Sat",
];

export function startOfDay(date: Date): Date {
    const copy = new Date(date);
    copy.setHours(0, 0, 0, 0);
    return copy;
}

export function endOfDay(date: Date): Date {
    const copy = new Date(date);
    copy.setHours(23, 59, 59, 999);
    return copy;
}

export function parseLocalDate(value: string): Date {
    const match = value.match(/^(\d{4})-(\d{2})-(\d{2})$/);

    if (match) {
        const year = Number(match[1]);
        const month = Number(match[2]) - 1;
        const day = Number(match[3]);
        return new Date(year, month, day);
    }

    return new Date(value);
}

export function getStartOfWeek(date: Date): Date {
    const copy = startOfDay(date);
    copy.setDate(copy.getDate() - copy.getDay());
    return copy;
}

export function getEndOfWeek(date: Date): Date {
    const start = getStartOfWeek(date);
    const end = new Date(start);
    end.setDate(start.getDate() + 6);
    return endOfDay(end);
}

export function normalizeWeekday(value?: string | null): Weekday | null {
    if (!value) return null;

    const normalized = value.trim().toLowerCase();

    if (normalized === "sun" || normalized === "sunday") return "Sun";
    if (normalized === "mon" || normalized === "monday") return "Mon";
    if (
        normalized === "tue" ||
        normalized === "tues" ||
        normalized === "tuesday"
    )
        return "Tue";
    if (normalized === "wed" || normalized === "wednesday") return "Wed";
    if (
        normalized === "thu" ||
        normalized === "thur" ||
        normalized === "thurs" ||
        normalized === "thursday"
    )
        return "Thu";
    if (normalized === "fri" || normalized === "friday") return "Fri";
    if (normalized === "sat" || normalized === "saturday") return "Sat";

    return null;
}

export function formatLocalDate(value: string): string {
    return parseLocalDate(value).toLocaleDateString();
}
