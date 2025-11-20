import { useEffect, useState, useCallback } from "react";
import { apiGetMyTeams } from "../api/teams";
import { useAuth } from "@/shared/hooks/useAuth";
import type { Team } from "../types/teams";

export function useTeams() {
  const { token } = useAuth();

  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    const data = await apiGetMyTeams(token);
    setTeams(data);
    setLoading(false);
  }, [token]);

  useEffect(() => {
    load();
  }, [load]);

  return {
    teams,
    loading,
    reloadTeams: load,
  };
}
