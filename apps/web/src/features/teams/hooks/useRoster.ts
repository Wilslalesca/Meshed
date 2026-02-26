import { useEffect, useState } from "react";
import { apiGetRoster, apiRemoveAthlete } from "../api/teams";
import { useAuth } from "@/shared/hooks/useAuth";
import type { Athlete } from "../types/roster";

export function useRoster(teamId: string) {
  const { token } = useAuth();
  const [roster, setRoster] = useState<Athlete[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    if (!token) return;
    setLoading(true);
    const data = await apiGetRoster(teamId, token);
    setRoster(data);
    setLoading(false);
  }

  async function removeAthlete(userId: string) {
    if (!token) return false;

    const ok = await apiRemoveAthlete(teamId, userId, token);
    if (ok) load();

    return ok;
  }

  useEffect(() => {
    load();
  }, [teamId, token]);

  return { roster, loading, reloadRoster: load, removeAthlete };
}
