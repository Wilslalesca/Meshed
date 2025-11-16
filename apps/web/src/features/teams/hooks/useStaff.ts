import { useState, useEffect, useCallback } from "react";
import { apiGetStaff } from "../api/staff";
import { useAuth } from "@/shared/hooks/useAuth";
import type { StaffMember } from "../types/staff";

export function useStaff(teamId: string) {
  const { token } = useAuth();

  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!token || !teamId) return;
    setLoading(true);
    const data = await apiGetStaff(teamId, token);
    setStaff(data);
    setLoading(false);
  }, [teamId, token]);

  useEffect(() => {
    load();
  }, [load]);

  return {
    staff,
    loading,
    reload: load,
  };
}
