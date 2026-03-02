import { useCallback, useEffect, useState } from "react";
import { apiGetRoster, apiRemoveAthlete } from "../api/teams";
import { useAuth } from "@/shared/hooks/useAuth";
import type { Athlete } from "../types/roster";

export function useRoster(teamId: string) {
  const { token } = useAuth();
  const [roster, setRoster] = useState<Athlete[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    const data = await apiGetRoster(teamId, token);
    setRoster(data);
    setLoading(false);
  }, [teamId, token]);

  const removeAthlete = useCallback(async (userId: string) => {
    if (!token) return false;

    const ok = await apiRemoveAthlete(teamId, userId, token);
    if (ok) load();

    return ok;
  }, [teamId, token, load]);

  useEffect(() => {
    void load();
  }, [load]);

  return { roster, loading, reloadRoster: load, removeAthlete };
}
