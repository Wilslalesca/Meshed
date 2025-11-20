import { useState } from "react";
import { apiDeleteTeam } from "../api/teams";
import { useAuth } from "@/shared/hooks/useAuth";

export function useDeleteTeam(teamId: string) {
  const { token } = useAuth();
  const [loading, setLoading] = useState(false);

  const remove = async (): Promise<boolean> => {
    if (!token) return false;

    setLoading(true);
    const ok = await apiDeleteTeam(teamId, token);
    setLoading(false);

    return ok;
  };

  return { remove, loading };
}
