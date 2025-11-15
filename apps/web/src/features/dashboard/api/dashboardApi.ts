import { getAthleteSchedule } from '@/features/athlete-schedule/api/getAthleteSchedule';
export const API_BASE = import.meta.env.VITE_API_BASE_URL;




export async function getAthleteEvents(athleteId: string) {
    const schedule = await getAthleteSchedule(athleteId);

    return schedule.map((item) => ({
        id: item.id,
        title: item.name,
        date: item.start_date,
        time: `${item.start_time} - ${item.end_time}`,
    }));
}
