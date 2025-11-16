export const API_BASE = import.meta.env.VITE_API_BASE_URL;
import type {
  Team,
  CreateTeamPayload,
  UpdateTeamPayload,
  SportLookup,
  League,
} from "../types/teams";
import type { Athlete } from "../types/roster";

export async function apiGetMyTeams(token: string): Promise<Team[]> {
  try {
    const res = await fetch(`${API_BASE}/teams/mine`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    return res.ok ? await res.json() : [];
  } catch (err) {
    console.error("Failed to load teams:", err);
    return [];
  }
}

export async function apiGetTeamById(
  teamId: string,
  token: string
): Promise<Team | null> {
  try {
    const res = await fetch(`${API_BASE}/teams/${teamId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
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

export async function apiGetRoster(
  teamId: string,
  token: string
): Promise<Athlete[]> {
  try {
    const res = await fetch(`${API_BASE}/teams/${teamId}/athletes`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) return [];
    return await res.json();
  } catch (err) {
    console.error("Roster error:", err);
    return [];
  }
}

export async function apiCreateTeam(
  data: CreateTeamPayload,
  token: string
): Promise<Team | undefined> {
  try {
    const res = await fetch(`${API_BASE}/teams`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!res.ok) throw new Error(await res.text());
    return await res.json();
  } catch (err) {
    console.error("Create team error:", err);
    return undefined;
  }
}

export async function apiUpdateTeam(
  teamId: string,
  data: UpdateTeamPayload,
  token: string
): Promise<Team | null> {
  try {
    const res = await fetch(`${API_BASE}/teams/${teamId}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    return res.ok ? await res.json() : null;
  } catch (err) {
    console.error("Update team failed:", err);
    return null;
  }
}

export async function apiDeleteTeam(teamId: string, token: string) {
  const res = await fetch(`${API_BASE}/teams/${teamId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.ok;
}

export async function apiRemoveUserFromTeam(
  teamId: string,
  userId: string,
  token: string
) {
  try {
    const res = await fetch(`${API_BASE}/teams/${teamId}/users/${userId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return res.ok;
  } catch (err) {
    console.error("Failed to remove user:", err);
    return false;
  }
}
export async function apiAddAthleteByEmail(
  teamId: string,
  email: string,
  token: string
) {
  try {
    const res = await fetch(
      `${API_BASE}/teams/${teamId}/athletes/by-email`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      }
    );

    if (!res.ok) {
      return { success: false, message: await res.text() };
    }

    return { success: true };
  } catch (err) {
    console.error("Add athlete error:", err);
    return {
      success: false,
      message: "Network error",
    };
  }
}

