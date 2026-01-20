import type { BaseTeamEvent } from "../event";

export interface BaseEventInput {
  id?: string;
  teamId: string;
  teamFacilityId?:string;
  name?:string;
  startDate: Date;
  endDate?: Date;
  startTime: string;
  endTime: string;
  reoccurring: boolean;
  reoccurrType?: BaseTeamEvent["reoccurrType"];
  dayOfWeek?: string;
  status?:string;
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

export interface FullEventInput extends BaseEventInput {
  opponent?: string;
  homeAway?: "Home" | "Away";
  notes?: string;
  liftType?: string;
}
