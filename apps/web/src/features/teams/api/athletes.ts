export const API_BASE = import.meta.env.VITE_API_BASE_URL;

export async function apiGetAthleteById(id: string, token: string) {
  try {
    const res = await fetch(`${API_BASE}/athletes/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.ok ? await res.json() : null;
  } catch {
    return null;
  }
}
