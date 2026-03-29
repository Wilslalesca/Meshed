import { useEffect, useState } from "react";
import { useAuth } from "@/shared/hooks/useAuth";
import { apiGetMyTeams } from "@/features/teams/api/teams";
import type { Team } from "@/features/teams/types/teams";

export function useUserTeams() {
  const { token } = useAuth();
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchTeams() {
            if (!token) return;
            setLoading(true);
            const data = await apiGetMyTeams(token);
            setTeams(data);
            setLoading(false);
        }
        fetchTeams();
    }, [token]);

  return { teams, loading };
}