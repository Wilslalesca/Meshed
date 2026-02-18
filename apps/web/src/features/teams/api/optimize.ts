import type { OptimizationRequest } from "../types/OptimizationRequest";
export const API_BASE = import.meta.env.VITE_API_BASE_URL;

export async function apiOptimizeSchedule(
    teamId: string,
    data: OptimizationRequest,
    token: string
) {
    const res = await fetch(`${API_BASE}/optimization/run`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            ...(data as unknown as Record<string, unknown>),
            teamId,
        }),
    });

    if (!res.ok) {
        throw new Error("Optimization failed");
    }

    return await res.json();
}
