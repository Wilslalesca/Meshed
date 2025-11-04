import { useEffect, useState } from "react";
import { getAthleteSchedule } from "../api/getAthleteSchedule";
import type { Schedule } from "../types/Schedule";

export function useAthleteSchedule(athleteId?: string) {
    const [schedule, setSchedule] = useState<Schedule[] | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!athleteId) {
            setSchedule(null);
            return;
        }

        const fetchData = async () => {
            setLoading(true);
            setError(null);

            const data = await getAthleteSchedule(athleteId);
            setSchedule(data);
            setLoading(false);
        };

        fetchData();
    }, [athleteId]);

    return { schedule, loading, error };
}