export const API_BASE = import.meta.env.VITE_API_BASE_URL;

export async function apiInviteUser(teamId: string, email: string, role: string, position: string | null, token: string) {
  const res = await fetch(`${API_BASE}/invites/${teamId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ email, role, position }),
  });

  if (!res.ok) return null;
  return await res.json();
}

export async function apiAcceptInvite(token: string) {
  const res = await fetch(`${API_BASE}/invites/accept/${token}`);
  
  if (!res.ok) return null;

  return await res.json(); 

}
