import type { Schedule } from '../types/Schedule';
export const API_BASE = import.meta.env.VITE_API_BASE_URL;

export async function getAthleteSchedule(athleteId: string): Promise<Schedule[]> {

    try {
        const response = await fetch(`${API_BASE}/schedule/athlete/${athleteId}`, {
            credentials: 'include',
        });

        if (!response.ok) {
            if (response.status === 404) {
                return [];
            }
            const errText = await response.text();
            throw new Error(`Failed to fetch athlete schedule: ${response.status} ${errText || response.statusText}`);
        }

        const text = await response.text();
        if (!text) {
            return [];
        }

        const data = JSON.parse(text) as Schedule[];
        return Array.isArray(data) ? data : [];

    } catch (error) {
        console.error('Error fetching athlete schedule:', error);
        throw error;
    }
}