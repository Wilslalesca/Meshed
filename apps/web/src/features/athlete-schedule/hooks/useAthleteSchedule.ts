import { useEffect, useState } from "react";
import { getAthleteSchedule } from "../api/getAthleteSchedule";
import { useAuth } from "@/shared/hooks/useAuth";
import type { Schedule } from "../types/Schedule";

export function useAthleteSchedule(athleteId?: string) {
    const { token } = useAuth();
    const [schedule, setSchedule] = useState<Schedule[] | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!athleteId || !token) {
            setSchedule(null);
            return;
        }

        const fetchData = async () => {
            setLoading(true);
            setError(null);

            const data = await getAthleteSchedule(athleteId, token);
            setSchedule(data);
            setLoading(false);
        };

        fetchData();
    }, [athleteId, token]);

    return { schedule, loading, error };
}