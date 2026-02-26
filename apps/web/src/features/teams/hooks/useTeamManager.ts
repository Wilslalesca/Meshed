import { useMemo } from "react";
import { useAuth } from "@/shared/hooks/useAuth";
import { useStaff } from "./useStaff";
import type { StaffMember } from "../types/staff";

export function useIsTeamManager(teamId: string) {
  const { user } = useAuth();
  const { staff } = useStaff(teamId);

  const isManager = useMemo(() => {
    const uid = user?.id;
    if (!uid) return false;
    return staff.some((s: StaffMember) => s.user_id === uid && s.role === "manager");
  }, [user?.id, staff]);

  return { isManager };
}
