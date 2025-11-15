export const API_BASE = import.meta.env.VITE_API_BASE_URL;
import type { SportLookup, League, Athlete } from "../types/teams";


export async function apiGetMyTeams(token: string) {
    try {
        const res = await fetch(`${API_BASE}/teams/mine`, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });

        if (!res.ok) {
            console.error("Failed to load teams");
            return [];
        }

        return (await res.json()) ?? [];
    } catch (err) {
        console.error("Error fetching teams:", err);
        return [];
    }
}

export async function apiGetSports(): Promise<SportLookup[]> {
    try {
        const res = await fetch(`${API_BASE}/lookups/sports`);
        return res.ok ? await res.json() : [];
    } catch {
        return [];
    }
}

export async function apiGetLeagues(): Promise<League[]> {
    try {
        const res = await fetch(`${API_BASE}/lookups/leagues`);
        return res.ok ? await res.json() : [];
    } catch (err) {
        console.error("Error fetching leagues", err);
        return [];
    }
}

export async function apiGetRoster(teamId: string, token: string) {
    try {
        const res = await fetch(`${API_BASE}/teams/${teamId}/athletes`, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });

        if (!res.ok) {
            const err = await res.text();
            throw new Error(err || "Failed to load roster");
        }

        return (await res.json()) as Athlete[];
    } catch (err) {
        console.error("Roster error:", err);
        return [];
    }
}

export async function apiAddAthleteByEmail(
    teamId: string,
    email: string,
    token: string
) {
    try {
        const res = await fetch(`${API_BASE}/teams/${teamId}/athletes/by-email`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ email }),
        });

        if (!res.ok) {
            const txt = await res.text();
            throw new Error(txt);
        }

        return { success: true };
    } catch (err) {
        console.error("Add athlete error:", err);
        return { success: false, message: err instanceof Error ? err.message : String(err) };
    }
}

export async function apiCreateTeam(data: unknown, token: string) {
    try {
        const res = await fetch(`${API_BASE}/teams`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(data),
        });

        if (!res.ok) {
            const txt = await res.text();
            throw new Error(txt);
        }

        return await res.json();
    } catch (err) {
        console.error("Create team error:", err);
        return undefined;
    }
}