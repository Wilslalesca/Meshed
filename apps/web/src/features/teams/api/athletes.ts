export const API_BASE = import.meta.env.VITE_API_BASE_URL;

export async function apiGetAthleteById(athleteId: string, token: string) {
    const res = await fetch(`${API_BASE}/athletes/${athleteId}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
        credentials: "include",
    });

    if (!res.ok) return null;
    return await res.json();
}
