import type { TeamEvent } from "@/features/teams/types/event";

export interface EventItem {
    id: string;
    title: string;
    date: string;
    time: string;
}

export type FacilityCalendarItem = {
    id: string,
    title: string,
    start: Date,
    end:Date,
    extendedProps: {
        originalEvent:TeamEvent
    }
};