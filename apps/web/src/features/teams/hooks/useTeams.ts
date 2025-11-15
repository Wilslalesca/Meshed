import { useEffect, useState } from "react";
import { useAuth } from "@/shared/hooks/useAuth";
import { apiGetMyTeams } from "../api/teams";
import type { Team } from "../types/teams";

export function useTeams() {
    const { token } = useAuth();
    const [teams, setTeams] = useState<Team[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null);

    const loadTeams = async () => {
        if (!token) return;
        const data = await apiGetMyTeams(token);
        setTeams(data);

        if (data.length && !selectedTeamId) {
            setSelectedTeamId(data[0].id);
        }

        setLoading(false);
    };

    useEffect(() => {
        loadTeams();
    }, [token]);

    return { teams, loading, selectedTeamId, setSelectedTeamId, reloadTeams: loadTeams };
}
