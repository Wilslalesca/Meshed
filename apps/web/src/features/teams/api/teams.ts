export const API_BASE = import.meta.env.VITE_API_BASE_URL;
import type {
    Team,
    CreateTeamPayload,
    UpdateTeamPayload,
    SportLookup,
    League,
} from "../types/teams";

export async function apiGetMyTeams(token: string): Promise<Team[]> {
    try {
        console.log("Fetching my teams with token:", token);
        const res = await fetch(`${API_BASE}/teams/mine`, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });
        console.log("apiGetMyTeams response:", res);
        return res.ok ? await res.json() : [];
    } catch {
        return [];
    }
}

export async function apiGetTeamById(teamId: string, token: string) {
    try {
        const res = await fetch(`${API_BASE}/teams/${teamId}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return res.ok ? await res.json() : null;
    } catch {
        return null;
    }
}

export async function apiGetSports(): Promise<SportLookup[]> {
    const res = await fetch(`${API_BASE}/lookups/sports`);
    return res.ok ? await res.json() : [];
}

export async function apiGetLeagues(): Promise<League[]> {
    const res = await fetch(`${API_BASE}/lookups/leagues`);
    return res.ok ? await res.json() : [];
}


export async function apiGetRoster(teamId: string, token: string) {
    const res = await fetch(`${API_BASE}/teams/${teamId}/athletes`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return res.ok ? await res.json() : [];
}

export async function apiCreateTeam(
    data: CreateTeamPayload,
    token: string
) {
    const res = await fetch(`${API_BASE}/teams`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });

    if (!res.ok) {
        const msg = await res.text().catch(() => "");
        throw new Error(msg || `Failed to create team (HTTP ${res.status})`);
    }

    return await res.json();
}


export async function apiUpdateTeam(
    teamId: string,
    data: UpdateTeamPayload,
    token: string
) {
    const res = await fetch(`${API_BASE}/teams/${teamId}`, {
        method: "PUT",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });

    return res.ok ? await res.json() : null;
}

export async function apiDeleteTeam(teamId: string, token: string) {
    const res = await fetch(`${API_BASE}/teams/${teamId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
    });
    return res.ok;
}

export async function apiAddAthleteByEmail(teamId: string, email: string, token: string) {
    const res = await fetch(`${API_BASE}/teams/${teamId}/athletes/by-email`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
    });

    return res.ok;
}

export async function apiBulkAddAthletesByCsv(teamId: string, file: File, token: string) {
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch(`${API_BASE}/teams/${teamId}/athletes/bulk-upload`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
        },
        body: formData,
    });

    if (!res.ok) {
        const errorData = await res.json().catch(() => ({ message: "Upload failed" }));
        throw new Error(errorData.message || "Upload failed");
    }

    return await res.json();
}

export async function apiRemoveAthlete(teamId: string, userId: string, token: string) {
    const res = await fetch(`${API_BASE}/teams/${teamId}/athletes/${userId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
    });

    return res.ok;
}