import { useEffect, useState } from "react";
import { useAuth } from "@/shared/hooks/useAuth";
import { apiGetTeamSchedule } from "../api/teamSchedule";

import type { TeamScheduleEvent } from "../types/schedule";

export const useTeamSchedule = (teamId: string, fromISO: string, toISO: string) => {
    const { token } = useAuth();
    const [events, setEvents] = useState<TeamScheduleEvent[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    useEffect(() => {
        let cancelled = false;

        async function fetchSchedule() {

            if (!teamId || !token) return;

            setLoading(true);
            setError(null);

            try {
                const res = await apiGetTeamSchedule(teamId, token, fromISO, toISO);
                if (!cancelled) setEvents(res);

            } catch (err) {
                const msg = err instanceof Error ? err.message : String(err);
                if (!cancelled) setError(msg);

            } finally {
                if (!cancelled) setLoading(false);

            }
        }

        fetchSchedule();

        return () => {
            cancelled = true;
        };
    }, [teamId, token, toISO]);

    return { events, loading, error };
};