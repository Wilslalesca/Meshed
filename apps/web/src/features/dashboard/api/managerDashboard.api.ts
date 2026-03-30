import { API_BASE } from "@/features/dashboard/api/userDashboard.api";
import type { RawTeamEvent } from "@/features/dashboard/types/api";
import { apiGetRoster } from "@/features/teams/api/teams";
import type { Athlete } from "@/features/teams/types/roster";
import type { Team } from "@/features/teams/types/teams";

export type ManagerDashboardStats = {
    totalAthletes: number;
    totalTeamEvents: number;
    pendingEvents: number;
    approvedEvents: number;
    deniedEvents: number;
};

export async function apiGetTeamEventsRaw(
    teamId: string,
    token: string,
): Promise<RawTeamEvent[]> {
    try {
        const res = await fetch(`${API_BASE}/teams/${teamId}/events`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (!res.ok) return [];

        const data = (await res.json()) as RawTeamEvent[];
        return Array.isArray(data) ? data : [];
    } catch {
        return [];
    }
}

export async function apiGetManagerDashboardStats(
    teams: Team[],
    token: string,
): Promise<ManagerDashboardStats> {
    if (!token || teams.length === 0) {
        return {
            totalAthletes: 0,
            totalTeamEvents: 0,
            pendingEvents: 0,
            approvedEvents: 0,
            deniedEvents: 0,
        };
    }

    try {
        const [rosters, teamEventLists] = await Promise.all([
            Promise.all(teams.map((team) => apiGetRoster(team.id, token))),
            Promise.all(
                teams.map((team) => apiGetTeamEventsRaw(team.id, token)),
            ),
        ]);

        const totalAthletes = rosters.reduce((sum, roster) => {
            const items = Array.isArray(roster) ? (roster as Athlete[]) : [];
            return (
                sum +
                items.filter((athlete) => athlete.status === "active").length
            );
        }, 0);

        const totalTeamEvents = teamEventLists.reduce((sum, events) => {
            return sum + (Array.isArray(events) ? events.length : 0);
        }, 0);

        const pendingEvents = teamEventLists.reduce((sum, events) => {
            const items = Array.isArray(events) ? events : [];
            return (
                sum +
                items.filter(
                    (event) =>
                        String(event.status ?? "")
                            .trim()
                            .toLowerCase() === "pending",
                ).length
            );
        }, 0);

        const approvedEvents = teamEventLists.reduce((sum, events) => {
            const items = Array.isArray(events) ? events : [];
            return (
                sum +
                items.filter(
                    (event) =>
                        String(event.status ?? "")
                            .trim()
                            .toLowerCase() === "approved",
                ).length
            );
        }, 0);

        const deniedEvents = teamEventLists.reduce((sum, events) => {
            const items = Array.isArray(events) ? events : [];
            return (
                sum +
                items.filter((event) => {
                    const status = String(event.status ?? "")
                        .trim()
                        .toLowerCase();
                    return status === "denied" || status === "rejected";
                }).length
            );
        }, 0);

        return {
            totalAthletes,
            totalTeamEvents,
            pendingEvents,
            approvedEvents,
            deniedEvents,
        };
    } catch {
        return {
            totalAthletes: 0,
            totalTeamEvents: 0,
            pendingEvents: 0,
            approvedEvents: 0,
            deniedEvents: 0,
        };
    }
}
