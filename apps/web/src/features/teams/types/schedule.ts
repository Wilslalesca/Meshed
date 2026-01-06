export const TeamScheduleView = {
    Month: "dayGridMonth",
    Week: "timeGridWeek",
    Day: "timeGridDay",
} as const;

export type TeamScheduleView = (typeof TeamScheduleView)[keyof typeof TeamScheduleView];

export type TeamScheduleEvent = {
    id: string;
    athleteId: string;
    athleteName: string;
    title: string;
    location?: string;
    startTime: string;
    endTime: string;
    description?: string;
    type: "class" | "practice" | "meeting" | "other";
};
