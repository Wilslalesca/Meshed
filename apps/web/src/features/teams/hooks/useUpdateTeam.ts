import { useState } from "react";
import { apiUpdateTeam } from "../api/teams";
import { useAuth } from "@/shared/hooks/useAuth";
import type { UpdateTeamPayload, Team } from "../types/teams";

export function useUpdateTeam(teamId: string) {
  const { token } = useAuth();
  const [loading, setLoading] = useState(false);

  const updateTeam = async (data: UpdateTeamPayload): Promise<Team | null> => {
    if (!token) return null;

    setLoading(true);
    const updated = await apiUpdateTeam(teamId, data, token);
    setLoading(false);

    return updated;
  };

  return { updateTeam, loading };
}
