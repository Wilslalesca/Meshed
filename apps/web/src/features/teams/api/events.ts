export const API_BASE = import.meta.env.VITE_API_BASE_URL;
import type { TeamEvent } from "../types/event";

export async function apiAddTeamEvent(
    data: TeamEvent,
    token: string
) {
    const res = await fetch(`${API_BASE}/teams/${data.teamId}/addEvent`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`, // do i keep this?
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });

    return res.ok ? await res.json() : undefined;
}