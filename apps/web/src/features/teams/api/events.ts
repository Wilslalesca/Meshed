export const API_BASE = import.meta.env.VITE_API_BASE_URL;
import type { TeamEvent } from "../types/event";
import type { Facility } from "@/features/facilities/types/facilities";

export async function apiAddTeamEvent(
    data: TeamEvent,
    token: string
) {
    const res = await fetch(`${API_BASE}/teams/${data.teamId}/addEvent`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });

    return res.ok ? await res.json() : undefined;
}

export async function apiGetEventFacilities(
    token: string
) {
    const res = await fetch(`${API_BASE}/facilities`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
    });
    const data: Facility[] = await res.json();

    return res.ok ? data : undefined;
}

export async function apiUpdateEventStatus(
    data: {status:string, id:string},
    token: string
) {
    const res = await fetch(`${API_BASE}/events/${data.id}/${data.status}`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
    });

    return res.ok ? data : undefined;
}