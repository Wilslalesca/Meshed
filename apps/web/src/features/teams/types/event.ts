export const ReoccurrType = [
    "Daily",
    "Weekly",
    "Bi-Weekly",
    "Monthly",
] as const;
export type ReoccurrType = (typeof ReoccurrType)[number];

export const TeamEventType = [
    "Game",
    "Practice",
    "Lift",
    "Class",
    "Team Event",
    "Other",
] as const;
export type TeamEventType = (typeof TeamEventType)[number];

export interface BaseTeamEvent {
    id?: string;
    teamId: string;
    teamFacilityId?: string; //allow nulls?
    name?: string;
    type: TeamEventType;
    startDate: string;
    endDate?: string;
    startTime: string;
    endTime: string;
    reoccurring: boolean;
    reoccurrType?: ReoccurrType;
    dayOfWeek?: string;
    status?: string;
    conflict?: boolean;

    requestedByUserId?: string;
    requestedByUserName?: string;
    requestedByEmail?: string;

    approvedByUserId?: string;
    approvedByUserName?: string;
    approvedByEmail?: string;
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

export type TeamEvent = PracticeEvent | GameEvent | LiftEvent | OtherEvent;
