import { useEffect, useState } from "react";
import { apiGetAthleteById } from "../api/athletes";
import { useAuth } from "@/shared/hooks/useAuth";
import type { Athlete } from "../../teams/types/roster";

export const useAthleteByIds = (athleteIds: string[]) => {
  const { token } = useAuth();
  const [athletes, setAthletes] = useState<Athlete[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancel = false;

    const load = async () => {
      setLoading(true);
      const data = await Promise.all(
        athleteIds.map(id =>apiGetAthleteById(id, token!))
      )
      if (!cancel){
        setAthletes(data);
      }
      setLoading(false);
    };

    load();
    return () => { cancel = true };
  }, [athleteIds, token]);

  return { athletes, loading };
};
