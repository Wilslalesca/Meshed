export type RawScheduleItem = {
    id: string;
    name: string;
    start_date: string;
    end_date?: string | null;
    start_time?: string | null;
    end_time?: string | null;
    team?: string | null;
    team_name?: string | null;
    location?: string | null;
    facility_name?: string | null;
    status?: string | null;
    day_of_week?: string | null;
    recurring?: boolean | null;
};

export type RawNotification = {
    id: string;
    message: string;
    type?: string | null;
    created_at?: string;
    read_at?: string | null;
};

export type RawTeam = {
    id: string;
    name: string;
};

export type RawTeamEvent = {
    id: string;
    name?: string;
    startDate?: string;
    endDate?: string | null;
    startTime?: string | null;
    endTime?: string | null;
    start_date?: string;
    end_date?: string | null;
    start_time?: string | null;
    end_time?: string | null;
    status?: string | null;
    notes?: string | null;
    teamId?: string;
    teamFacilityId?: string | null;
    team_id?: string;
    team_facility_id?: string | null;
    location?: string | null;
    facility_name?: string | null;
    facilityName?: string | null;
    day_of_week?: string | null;
    reoccurring?: boolean | null;
    reoccurr_type?: string | null;
};