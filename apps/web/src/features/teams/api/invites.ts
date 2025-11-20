export const API_BASE = import.meta.env.VITE_API_BASE_URL;
import type { Invite } from "../types/staff";

type InvitePayload = {
  email: string;
  role: string;
  position?: string | null;
};

export async function apiInviteUser(
  teamId: string,
  email: string,
  role: string,
  position: string | null,
  token: string
): Promise<{ success: boolean; invite?: Invite }> {
  try {
    const res = await fetch(`${API_BASE}/invites/${teamId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ email, role, position }),
    });

    if (!res.ok) return { success: false };

    const data = await res.json();
    return { success: true, invite: data.invite };
  } catch (err) {
    console.error("Invite error:", err);
    return { success: false };
  }
}

export async function apiAcceptInvite(token: string) {
  const res = await fetch(`${API_BASE}/invites/accept/${token}`);
  return res.ok;
}

export async function apiInviteToTeam(
  teamId: string,
  payload: InvitePayload,
  token: string
) {
  try {
    const res = await fetch(`${API_BASE}/invites/${teamId}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      console.error("Invite failed", await res.text());
      return null;
    }

    return await res.json();
  } catch (err) {
    console.error("invite error:", err);
    return null;
  }
}
