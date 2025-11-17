export const API_BASE = import.meta.env.VITE_API_BASE_URL;
import type { StaffMember } from "../types/staff";

export async function apiAddStaff(teamId: string, email: string, role: string, notes: string | null, token: string) {
    const res = await fetch(`${API_BASE}/teams/${teamId}/staff`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, role, notes }),
    });
    return res.ok ? await res.json() : null;
}

export async function apiUpdateStaff(staffId: string, updates: Partial<StaffMember>, token: string) {
    const res = await fetch(`${API_BASE}/teams/staff/${staffId}`, {
        method: "PUT",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify(updates),
    });
    return res.ok ? await res.json() : null;
}

export async function apiGetStaff(teamId: string, token: string) {
    const res = await fetch(`${API_BASE}/teams/${teamId}/staff`, {
        headers: { Authorization: `Bearer ${token}` },
    });

    return res.ok ? await res.json() : [];
}

export async function apiRemoveStaff(staffId: string, token: string) {
    const res = await fetch(`${API_BASE}/teams/staff/${staffId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
    });

    return res.ok;
}
