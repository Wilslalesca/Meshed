import type { BaseTeamEvent } from "../event";

export interface BaseEventInput {
  teamId: string;
  startDate: string;
  endDate?: string;
  startTime: string;
  endTime: string;
  reoccurring: boolean;
  reoccurrType?: BaseTeamEvent["reoccurrType"];
  daysOfWeek?: string[];
}

export interface GameEventInput extends BaseEventInput {
  opponent: string;
  homeAway: "Home" | "Away";
}

export interface PracticeEventInput extends BaseEventInput {
  notes?: string;
}

export interface LiftEventInput extends BaseEventInput {
  liftType?: string;
}

export interface OtherEventInput extends BaseEventInput {
  notes?: string;
}
