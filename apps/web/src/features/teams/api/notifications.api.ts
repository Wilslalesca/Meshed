export const API_BASE = import.meta.env.VITE_API_BASE_URL;


export async function createTeamNotification(teamId: string, payload: { type: string; message: string; meta?: any }, token: string) {
    try {
        const res = await fetch(`${API_BASE}/notifications/team/${teamId}`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });
            if (!res.ok) {
                throw new Error("Failed to create team notification");
            }
            return await res.json();
    } catch (error) {
        throw new Error("Failed to create team notification");
    }
}
