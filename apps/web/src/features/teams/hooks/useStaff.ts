import { useCallback, useEffect, useState } from "react";
import { apiGetStaff, apiRemoveStaff, apiUpdateStaff } from "../api/staff";
import { useAuth } from "@/shared/hooks/useAuth";
import type { StaffMember } from "../types/staff";

export function useStaff(teamId: string) {
    const { token } = useAuth();
    const [staff, setStaff] = useState<StaffMember[]>([]);
    const [loading, setLoading] = useState(true);

    const reloadStaff = useCallback(async () => {
        if (!token) return;
        setLoading(true);
        const data = await apiGetStaff(teamId, token);
        setStaff(data);
        setLoading(false);
    }, [teamId, token]);

    const removeStaff = useCallback(async (staffId: string) => {
        if (!token) return;
        await apiRemoveStaff(teamId, staffId, token);
        await reloadStaff();
    }, [teamId, token, reloadStaff]);

    const updateStaff = useCallback(async (staffId: string, updates: StaffMember) => {
        if (!token) return;
        await apiUpdateStaff(teamId, staffId, updates, token);
        await reloadStaff();
    }, [teamId, token, reloadStaff]);

    useEffect(() => {
        void reloadStaff();
    }, [reloadStaff]);

    return {
        staff,
        loading,
        reloadStaff,
        removeStaff,
        updateStaff,
    };
}
