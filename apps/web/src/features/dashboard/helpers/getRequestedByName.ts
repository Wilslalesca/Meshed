import type { TeamEvent } from "@/features/teams/types/event";

export function getRequestedByName(event: TeamEvent) {
    if (event.requestedByUserName && event.requestedByUserName.trim() !== "") {
        return event.requestedByUserName;
    }

    if (event.requestedByEmail && event.requestedByEmail.trim() !== "") {
        return event.requestedByEmail;
    }

    return "-";
}