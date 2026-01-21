import { useEffect, useState } from "react";
import { useAuth } from "@/shared/hooks/useAuth";
import { apiGetAthleteScheduleRows, apiGetTeamEvents } from "../api/teamSchedule.API";
import { mapCourseRowsToScheduleEvents, mapTeamEventRowsToScheduleEvents } from "../Services/getTeamScheduleRange";

import type { TeamScheduleEvent } from "../types/schedule";
import { apiGetRoster } from "../api/teams";

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
                const teamRows = await apiGetTeamEvents(teamId, token);
                const mapped = mapTeamEventRowsToScheduleEvents(teamRows, fromISO, toISO);

                const roster = await apiGetRoster(teamId, token);
                const athletes = (roster ?? []).map((a: any) => ({
                    id: a.id ?? a.user_id ??  a.athleteId ?? a.athlete_id,
                    name: a.name ?? [a.first_name, a.last_name].filter(Boolean).join(" ") ?? a.email ?? "Unknown",
                })).filter((x: any) => typeof x.id === "string" && x.id.length > 0);

                const classEvents = await Promise.all(
                    athletes.map(async (athlete: { id: string; name: string; }) => {
                        const rows = await apiGetAthleteScheduleRows(athlete.id, token);
                        return mapCourseRowsToScheduleEvents(athlete, rows, fromISO, toISO);
                    })
                );
                const classEventsFlat = classEvents.flat();
                const merged = [...mapped, ...classEventsFlat].sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());

                if (!cancelled) setEvents(merged);

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
    }, [teamId, token, fromISO, toISO]);

    return { events, loading, error };
};