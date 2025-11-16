import { useEffect, useState, useCallback } from "react";
import { apiGetTeamById } from "../api/teams";
import { useAuth } from "@/shared/hooks/useAuth";
import type { Team } from "../types/teams";

export function useTeamById(teamId: string) {
  const { token } = useAuth();

  const [team, setTeam] = useState<Team | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!teamId || !token) return;

    setLoading(true);
    const data = await apiGetTeamById(teamId, token);
    setTeam(data);
    setLoading(false);
  }, [teamId, token]);

  useEffect(() => {
    load();
  }, [load]);

  return {
    team,
    loading,
    reload: load, 
  };
}
