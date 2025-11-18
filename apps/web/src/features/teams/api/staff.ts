export const API_BASE = import.meta.env.VITE_API_BASE_URL;
import type { StaffMember } from "../types/staff";

export async function apiAddStaff(teamId: string, email: string, role: string, notes: string | null, token: string) {
    return fetch(`${API_BASE}/teams/${teamId}/staff`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, role, notes }),
    }).then(r => r.ok ? r.json() : null);
}

export async function apiGetStaff(teamId: string, token: string) {
    const res = await fetch(`${API_BASE}/teams/${teamId}/staff`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return res.ok ? res.json() : [];
}
export async function apiUpdateStaff(teamId: string, staffId: string, updates: Partial<StaffMember>, token: string) {
    const res = await fetch(`${API_BASE}/teams/${teamId}/staff/${staffId}`, {
        method: "PUT",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify(updates),
    });
    return res.ok ? res.json() : null;
}

export async function apiRemoveStaff(teamId: string, staffId: string, token: string) {
    const res = await fetch(`${API_BASE}/teams/${teamId}/staff/${staffId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
    });
    return res.ok;
}