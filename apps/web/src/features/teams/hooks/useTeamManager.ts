import { useMemo } from "react";
import { useAuth } from "@/shared/hooks/useAuth";
import { useStaff } from "./useStaff";

export function useIsTeamManager(teamId: string) {
  const { user } = useAuth();
  const { staff } = useStaff(teamId);

  const isManager = useMemo(() => {
    const uid = user?.id;
    if (!uid) return false;
    return staff.some((s: any) => s.user_id === uid && s.role === "manager");
  }, [user?.id, staff]);

  return { isManager };
}
