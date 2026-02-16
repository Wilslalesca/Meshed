export type OptimizationRequest = {
    teamId?: string;
    optimizationType: "MAX_ATTENDANCE" | "MIN_MISSES";
    days: {
        day: string;
        options: {
            start: string;
            end: string;
        }[];
    }[];
};
