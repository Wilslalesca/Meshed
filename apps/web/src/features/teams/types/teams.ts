export type Role = "admin" | "manager" | "user";

export interface User {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    phone?: string;
    role: Role;
    active?: boolean;
    verified?: boolean;
    created_at?: string;
    updated_at?: string;
}

export interface SportLookup {
    id: string;
    sport_name: string;
    season: string | null;
    position: string | null;
}

export interface League {
    id: string;
    league_name: string;
}

export interface Team {
    id: string;
    name: string;
    sport_id: string | null;
    season: string | null;
    insights_id: string | null;
    league_id: string | null;
    gender: "male" | "female" | "coed" | string | null;
    created_at?: string;
    updated_at?: string;
}

export interface Athlete {
    id: string;
    first_name: string;
    last_name: string;
    email: string;

    role?: string | null;
    position?: string | null;
    status: string;
    joined_at: string;

    school_name?: string | null;
    year?: string | null;
    notes?: string | null;
}

export type RosterResponse = Athlete[];

export interface CreateTeamPayload {
    name: string;
    sport_id: string | null;
    season: string | null;
    league_id: string | null;
    gender: "male" | "female" | "coed" | null;
}

export interface AddAthleteByEmailPayload {
    email: string;
}

export interface TeamExpanded extends Team {
    sport?: SportLookup | null;
    league?: League | null;
}
