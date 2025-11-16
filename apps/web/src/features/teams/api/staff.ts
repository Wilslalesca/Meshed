export const API_BASE = import.meta.env.VITE_API_BASE_URL;
import type { StaffMember } from "../types/staff";

export async function apiGetStaff(teamId: string, token: string): Promise<StaffMember[]> {
  const res = await fetch(`${API_BASE}/staff/${teamId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return res.ok ? await res.json() : [];
}

export async function apiAddStaff(
  teamId: string,
  email: string,
  role: string,
  notes: string | null,
  token: string
): Promise<StaffMember | null> {
  const res = await fetch(`${API_BASE}/staff/${teamId}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, role, notes }),
  });

  return res.ok ? await res.json() : null;
}

export async function apiUpdateStaff(
  staffId: string,
  updates: Partial<StaffMember>,
  token: string
): Promise<StaffMember | null> {
  const res = await fetch(`${API_BASE}/staff/update/${staffId}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updates),
  });

  return res.ok ? await res.json() : null;
}

export async function apiRemoveStaff(staffId: string, token: string): Promise<boolean> {
  const res = await fetch(`${API_BASE}/staff/remove/${staffId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });

  return res.ok;
}
