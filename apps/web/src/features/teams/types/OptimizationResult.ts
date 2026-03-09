export type AthleteMissesMap = Record<string, number>;

export type ScheduleSlot = {
  start: string;
  end: string;
  athletesMissing: AthleteMissesMap;
};

export type MinMissesResult = {
  type: "MIN_MISSES";
  result: {
    athleteMisses: AthleteMissesMap;
    maxMisses: number;
    schedule: ScheduleSlot[];
  };
};

export type MaxAttendanceDay = {
  day: string;
  option: ScheduleSlot;
};

export type MaxAttendanceResult = {
  type: "MAX_ATTENDANCE";
  result: MaxAttendanceDay[];
};

export type OptimizationTeamEvent = {
  dayOfWeek:string;
  startTime:string;
  endTime: string;
}

export type OptimizedRow = {
    day: string;
    start: string;
    end: string;
    athletesMissing: AthleteMissesMap;
    source:OptimizationResult;
};

export type OptimizationResult = MinMissesResult | MaxAttendanceResult;