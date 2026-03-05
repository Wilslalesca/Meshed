type AthleteMissesMap = Record<string, number>;

export type ScheduleSlot = {
  start: string;
  end: string;
  athletesMissing: AthleteMissesMap;
};

export type OptimizationResult = {
  type: "MIN_MISSES" | "MAX_ATTENDANCE";
  result: {
    athleteMisses: AthleteMissesMap;
    maxMisses: number;
    schedule: ScheduleSlot[];
  };
};