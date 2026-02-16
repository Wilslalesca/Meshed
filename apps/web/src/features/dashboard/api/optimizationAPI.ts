import type { OptimizationRequest } from "../types/OptimizationRequest";
export const API_BASE = import.meta.env.VITE_API_BASE_URL;

export async function runOptimization(payload: OptimizationRequest, token: string) {
    const res = await fetch(`${API_BASE}/optimization/run`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
    });

    if (!res.ok) {
        throw new Error(`Optimization request failed with status ${res.status}`);
    }

    return res.json();
}
