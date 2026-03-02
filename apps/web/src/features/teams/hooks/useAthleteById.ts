import { useEffect, useState } from "react";
import { apiGetAthleteById } from "../api/athletes";
import { useAuth } from "@/shared/hooks/useAuth";
import type { Athlete } from "../../teams/types/roster";

export const useAthleteById = (athleteId: string) => {
  const { token } = useAuth();
  const [athlete, setAthlete] = useState<Athlete | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancel = false;

    const load = async () => {
      setLoading(true);
      const data = await apiGetAthleteById(athleteId, token!);
      if (!cancel) setAthlete(data);
      setLoading(false);
    };

    load();
    return () => { cancel = true };
  }, [athleteId, token]);

  return { athlete, loading };
};
