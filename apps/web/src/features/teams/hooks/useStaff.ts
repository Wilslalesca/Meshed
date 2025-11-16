import { useEffect, useState } from "react";
import { apiGetStaff, apiRemoveStaff } from "../api/staff";
import { useAuth } from "@/shared/hooks/useAuth";

export const useStaff = (teamId: string) => {
  const { token } = useAuth();
  const [staff, setStaff] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    if (!token) return;
    setLoading(true);
    const data = await apiGetStaff(teamId, token);
    setStaff(data);
    setLoading(false);
  }

  async function removeStaff(id: string) {
    if (!token) return;
    const ok = await apiRemoveStaff(teamId, id, token);
    if (ok) load();
  }

  useEffect(() => {
    load();
  }, [teamId]);

  return { staff, loading, reloadStaff: load, removeStaff };
};
