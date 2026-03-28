export type DashboardSource = "schedule" | "team";

export type DashboardEvent = {
    id: string;
    title: string;
    date: string;
    time: string;
    startTime?: string | null;
    endTime?: string | null;
    team?: string | null;
    location?: string | null;
    status?: string | null;
    source: DashboardSource;
    dayOfWeek?: string | null;
    recurring?: boolean | null;
    endDate?: string | null;
};

export type DashboardNotification = {
    id: string;
    text: string;
    time: string;
    type?: string | null;
    readAt?: string | null;
};

export type DashboardData = {
    events: DashboardEvent[];
    notifications: DashboardNotification[];
    unreadCount: number;
};

export type UpcomingEventRow = {
    id: string;
    title: string;
    date: string;
    time: string;
    team?: string | null;
    location?: string | null;
    status?: string | null;
};

export type Weekday = "Sun" | "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat";

export type WeekHoursDatum = {
    day: Weekday;
    hours: number;
};

export type UpcomingEventFilter = "all" | "today" | "week" | "schedule" | "team";
