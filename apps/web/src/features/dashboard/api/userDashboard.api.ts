export const API_BASE = import.meta.env.VITE_API_BASE_URL;
import { getAthleteSchedule } from "@/features/athlete-schedule/api/getAthleteSchedule";
import type {
    DashboardData,
    DashboardEvent,
    DashboardNotification,
} from "../types/dashboard";
import type {
    RawNotification,
    RawScheduleItem,
    RawTeam,
    RawTeamEvent,
} from "../types/api";
import {
    mapNotifications,
    mapScheduleEvents,
    mapTeamEvents,
} from "../utils/dashboardMappers";

async function getMyTeams(token: string): Promise<RawTeam[]> {
    const res = await fetch(`${API_BASE}/teams/mine`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (!res.ok) {
        const errText = await res.text();
        if (res.status === 404) return [];
        throw new Error(
            `Failed to fetch teams: ${res.status} ${errText || res.statusText}`,
        );
    }

    const data = (await res.json()) as RawTeam[];
    return Array.isArray(data) ? data : [];
}

async function getTeamEvents(
    teamId: string,
    token: string,
): Promise<RawTeamEvent[]> {
    const res = await fetch(`${API_BASE}/teams/${teamId}/events`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (!res.ok) {
        const errText = await res.text();
        if (res.status === 404) return [];
        throw new Error(
            `Failed to fetch team events for team ${teamId}: ${res.status} ${errText || res.statusText}`,
        );
    }

    const data = (await res.json()) as RawTeamEvent[];
    return Array.isArray(data) ? data : [];
}

async function getNotificationsRaw(
    userId: string,
    token: string,
    limit: number,
): Promise<RawNotification[]> {
    const res = await fetch(
        `${API_BASE}/notifications?userId=${userId}&limit=${limit}`,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        },
    );

    if (!res.ok) {
        const errText = await res.text();
        throw new Error(
            `Failed to fetch notifications: ${res.status} ${errText || res.statusText}`,
        );
    }

    const payload = await res.json();

    const items: RawNotification[] = Array.isArray(payload)
        ? payload
        : Array.isArray(payload?.items)
          ? payload.items
          : Array.isArray(payload?.notifications)
            ? payload.notifications
            : Array.isArray(payload?.result)
              ? payload.result
              : [];

    return items;
}

async function getUnreadCountRaw(
    userId: string,
    token: string,
): Promise<number> {
    const res = await fetch(
        `${API_BASE}/notifications/unreadCount?userId=${userId}`,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        },
    );

    if (!res.ok) {
        const errText = await res.text();
        throw new Error(
            `Failed to fetch unread notification count: ${res.status} ${errText || res.statusText}`,
        );
    }

    const payload = (await res.json()) as { count?: number };
    return typeof payload.count === "number" ? payload.count : 0;
}

export async function getUserDashboardEvents(
    athleteId: string,
    token: string,
): Promise<DashboardEvent[]> {
    const [schedule, teams] = await Promise.all([
        getAthleteSchedule(athleteId, token) as Promise<RawScheduleItem[]>,
        getMyTeams(token),
    ]);

    const scheduleEvents = mapScheduleEvents(schedule);

    const teamEventGroups = await Promise.all(
        teams.map(async (team: RawTeam): Promise<DashboardEvent[]> => {
            const rawTeamEvents = await getTeamEvents(team.id, token);
            return mapTeamEvents(team, rawTeamEvents);
        }),
    );

    return [...scheduleEvents, ...teamEventGroups.flat()].sort(
        (a: DashboardEvent, b: DashboardEvent) =>
            `${a.date} ${a.time}`.localeCompare(`${b.date} ${b.time}`),
    );
}

export async function getUserNotifications(
    userId: string,
    token: string,
    limit: number = 5,
): Promise<DashboardNotification[]> {
    const rawNotifications = await getNotificationsRaw(userId, token, limit);
    return mapNotifications(rawNotifications);
}

export async function getUnreadNotificationCount(
    userId: string,
    token: string,
): Promise<number> {
    return getUnreadCountRaw(userId, token);
}

export async function getUserDashboardData(
    athleteId: string,
    token: string,
): Promise<DashboardData> {
    const [events, notifications, unreadCount] = await Promise.all([
        getUserDashboardEvents(athleteId, token),
        getUserNotifications(athleteId, token, 5),
        getUnreadNotificationCount(athleteId, token),
    ]);

    return {
        events,
        notifications,
        unreadCount,
    };
}
