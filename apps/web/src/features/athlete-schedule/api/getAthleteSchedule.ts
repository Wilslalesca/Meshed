import type { Schedule } from '../types/Schedule';
export const API_BASE = import.meta.env.VITE_API_BASE_URL;

export async function getAthleteSchedule(athleteId: string): Promise<Schedule[]> {

    try {
        const response = await fetch(`${API_BASE}/schedule/athlete/${athleteId}`, {
            credentials: 'include',
        });

        if (!response.ok) {
            throw new Error('Failed to fetch athlete schedule');
        }

        return await response.json();


    } catch (error) {
        console.error('Error fetching athlete schedule:', error);
        throw error;
    }
}