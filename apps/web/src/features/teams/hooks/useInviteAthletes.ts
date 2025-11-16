import { useState } from "react";
import { apiInviteUser } from "../api/invites";
import { useAuth } from "@/shared/hooks/useAuth";

export function useInviteAthlete(teamId: string) {
  const { token } = useAuth();
  const [loading, setLoading] = useState(false);

  const invite = async (email: string) => {
    if (!token) return { success: false };

    setLoading(true);
    const res = await apiInviteUser(teamId, email, "athlete", null, token);
    setLoading(false);
    return res;
  };

  return { invite, loading };
}
