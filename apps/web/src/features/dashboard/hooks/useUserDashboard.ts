import { useCallback, useEffect, useState } from "react";
import { getUserDashboardData } from "../api/userDashboard.api";
import type { DashboardData } from "../types/dashboard";

export function useUserDashboard(userId?: string, token?: string) {
    const [data, setData] = useState<DashboardData>({
        events: [],
        notifications: [],
        unreadCount: 0,
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const load = useCallback(async (): Promise<void> => {
        if (!userId || !token) {
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            setError(null);

            const result = await getUserDashboardData(userId, token);
            setData(result);
        } catch (err: unknown) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Failed to load dashboard",
            );
        } finally {
            setLoading(false);
        }
    }, [userId, token]);

    useEffect(() => {
        void load();
    }, [load]);

    return {
        ...data,
        loading,
        error,
        refresh: load,
    };
}