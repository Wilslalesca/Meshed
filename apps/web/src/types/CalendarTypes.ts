export interface CalendarEvent {
    id: string;
    dayIndex: number;
    startHour: number;
    endHour: number;
}

export interface UserSchedule {
    userId: string;
    events: CalendarEvent[];
}