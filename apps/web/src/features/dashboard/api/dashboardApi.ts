import { getAthleteSchedule } from '@/features/athlete-schedule/api/getAthleteSchedule';
export const API_BASE = import.meta.env.VITE_API_BASE_URL;




export async function getAthleteEvents(athleteId: string, token: string) {
    const schedule = await getAthleteSchedule(athleteId, token);

    return schedule.map((item) => ({
        id: item.id,
        title: item.name,
        date: item.start_date,
        time: `${item.start_time} - ${item.end_time}`,
    }));
}

export async function getAllEvents(token: string) {
    try {
        const res = await fetch(`${API_BASE}/events`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return res.ok ? await res.json() : null;
    } catch {
        return null;
    }
}

export async function getFacilityEvents( facilityId: string, token: string) {
    try {
        const res = await fetch(`${API_BASE}/events/${facilityId}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return res.ok ? await res.json() : null;
    } catch {
        return null;
    }
}
