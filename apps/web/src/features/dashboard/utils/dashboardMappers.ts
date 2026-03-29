import type { DashboardEvent, DashboardNotification } from "../types/dashboard";
import type {
    RawFacility,
    RawNotification,
    RawScheduleItem,
    RawTeam,
    RawTeamEvent,
} from "../types/api";
import { formatRelativeTime } from "./notifications";
import { formatTimeRange } from "./time";

export function mapScheduleEvents(
    schedule: RawScheduleItem[],
): DashboardEvent[] {
    return schedule.map((item: RawScheduleItem) => ({
        id: `schedule-${item.id}`,
        title: item.name,
        date: item.start_date,
        time: formatTimeRange(item.start_time, item.end_time),
        startTime: item.start_time ?? null,
        endTime: item.end_time ?? null,
        team: item.team ?? item.team_name ?? null,
        location: item.location ?? item.facility_name ?? null,
        status: item.status ?? null,
        source: "schedule",
        dayOfWeek: item.day_of_week ?? null,
        recurring: item.recurring ?? null,
        endDate: item.end_date ?? null,
    }));
}

export function mapTeamEvents(
    team: RawTeam,
    events: RawTeamEvent[],
    facilities: RawFacility[],
): DashboardEvent[] {
    return events.map((item: RawTeamEvent) => {
        const startDate = item.startDate ?? item.start_date ?? "";
        const startTime = item.startTime ?? item.start_time ?? null;
        const endTime = item.endTime ?? item.end_time ?? null;

        const facilityId = item.teamFacilityId ?? item.team_facility_id ?? null;
        const facility = facilities.find(
            (curr: RawFacility) => curr.id === facilityId,
        );
       
        return {
            id: `team-${item.id}`,
            title: item.name ?? "Untitled Team Event",
            date: startDate,
            time: formatTimeRange(startTime, endTime),
            startTime,
            endTime,
            team: team.name,
            location:
                item.location ??
                item.facility_name ??
                item.facilityName ??
                facility?.name ??
                null,
            status: item.status ?? null,
            source: "team",
            dayOfWeek: item.day_of_week ?? null,
            recurring: item.reoccurring ?? null,
            endDate: item.endDate ?? item.end_date ?? null,
        };
    });
}

export function mapNotifications(
    items: RawNotification[],
): DashboardNotification[] {
    return items.map((item: RawNotification) => ({
        id: item.id,
        text: item.message,
        time: formatRelativeTime(item.created_at),
        type: item.type ?? null,
        readAt: item.read_at ?? null,
    }));
}
