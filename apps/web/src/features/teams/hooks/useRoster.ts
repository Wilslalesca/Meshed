import { useEffect, useState } from "react";
import { useAuth } from "@/shared/hooks/useAuth";
import { apiGetRoster } from "../api/teams";
import type { Athlete } from "../types/teams";

export function useRoster(teamId: string | null) {
    const { token } = useAuth();
    const [roster, setRoster] = useState<Athlete[]>([]);
    const [loading, setLoading] = useState(false);

    const loadRoster = async () => {
        if (!teamId || !token) return;
        setLoading(true);
        const data = await apiGetRoster(teamId, token);
        setRoster(data);
        setLoading(false);
    };

    useEffect(() => {
        loadRoster();
    }, [teamId]);

    return { roster, loading, reload: loadRoster };
}
