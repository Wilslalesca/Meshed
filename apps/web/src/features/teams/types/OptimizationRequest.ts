export type OptimizationRequest = "MAX_ATTENDANCE" | "MIN_MISSES";

export interface OptimizationRequestPayload{
    optimizationType: OptimizationRequest;
    days: {
        day: string;
        options: {
            start: string;
            end: string;
        }[];
    }[];
};