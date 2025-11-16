import { useEffect, useState } from "react";
import { apiGetTeamById } from "../api/teams";
import { useAuth } from "@/shared/hooks/useAuth";
import type { Team } from "../types/teams";

export function useTeamById(teamId: string) {
  const { token } = useAuth();

  const [team, setTeam] = useState<Team | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;

    setLoading(true);
    apiGetTeamById(teamId, token)
      .then((t) => setTeam(t))
      .finally(() => setLoading(false));
  }, [teamId, token]);

  return { team, loading };
}
