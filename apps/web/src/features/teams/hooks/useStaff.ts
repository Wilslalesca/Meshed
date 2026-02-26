import { useEffect, useState } from "react";
import { apiGetStaff, apiRemoveStaff, apiUpdateStaff } from "../api/staff";
import { useAuth } from "@/shared/hooks/useAuth";
import type { StaffMember } from "../types/staff";

export function useStaff(teamId: string) {
    const { token } = useAuth();
    const [staff, setStaff] = useState<StaffMember[]>([]);
    const [loading, setLoading] = useState(true);

    async function reloadStaff() {
        if (!token) return;
        setLoading(true);
        const data = await apiGetStaff(teamId, token);
        setStaff(data);
        setLoading(false);
    }

    async function removeStaff(staffId: string) {
        if (!token) return;
        await apiRemoveStaff(teamId, staffId, token);
        await reloadStaff();
    }

    async function updateStaff(staffId: string, updates: StaffMember) {
        if (!token) return;
        await apiUpdateStaff(teamId, staffId, updates, token);
        await reloadStaff();
    }

    useEffect(() => {
        reloadStaff();
    }, [teamId]);

    return {
        staff,
        loading,
        reloadStaff,
        removeStaff,
        updateStaff,
    };
}
