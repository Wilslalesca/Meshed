export type TeamEventType = "Practice" | "Game" | "Lift" | "Other";

export interface BaseTeamEvent {
  teamId: string;
  type: TeamEventType;
  startDate: Date;
  endDate?: Date;
  startTime: string;
  endTime: string;
  reoccurring: boolean;
  reoccurrType?: "Daily" | "Weekly" | "Bi-Weekly" | "Monthly";
  dayOfWeek?: string;
}

export interface PracticeEvent extends BaseTeamEvent {
  type: "Practice";
  notes?: string;
}

export interface GameEvent extends BaseTeamEvent {
  type: "Game";
  opponent: string;
  homeAway: "Home" | "Away";
}

export interface LiftEvent extends BaseTeamEvent {
  type: "Lift";
  liftType?: string;
}

export interface OtherEvent extends BaseTeamEvent {
  type: "Other";
  notes?: string;
}

export type TeamEvent =
  | PracticeEvent
  | GameEvent
  | LiftEvent
  | OtherEvent;
