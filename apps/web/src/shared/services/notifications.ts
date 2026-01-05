export const API_BASE = import.meta.env.VITE_API_URL;

export async function apiGetNotifications(token: string) {
  const res = await fetch(`${API_BASE}/notifications`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.ok ? await res.json() : [];
}

export async function apiMarkNotificationsRead(token: string) {
  const res = await fetch(`${API_BASE}/notifications/read`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.ok;
}
