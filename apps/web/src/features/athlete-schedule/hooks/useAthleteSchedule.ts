import { useEffect, useState, useCallback } from "react";
import { getAthleteSchedule } from "../api/getAthleteSchedule";
import { useAuth } from "@/shared/hooks/useAuth";
import type { Schedule } from "../types/Schedule";

export function useAthleteSchedule(athleteId?: string) {
    const { token } = useAuth();
    const [schedule, setSchedule] = useState<Schedule[] | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const fetchData = useCallback(async () => {
        if(!athleteId || !token) return;
        setLoading(true);
        setError(null);
        try{
            const data = await getAthleteSchedule(athleteId, token);
            setSchedule(data);
        }
        catch{
            setError("Failed to fetch schedule");
        }
        finally{
            setLoading(false);
        }
    },[athleteId, token]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return { schedule, loading, error, refetch:fetchData };
}