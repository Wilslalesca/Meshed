export type OptimizationRequest = {
    optimizationType: "MAX_ATTENDANCE" | "MIN_MISSES";
    days: {
        day: string;
        options: {
            start: string;
            end: string;
        }[];
    }[];
};
