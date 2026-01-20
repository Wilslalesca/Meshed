import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/shared/components/ui/card";
import { QuickActions } from "../components/user/QuickActions";
import { StatCard } from "../components/StatCard";
import { TeamSchedule } from "../components/user/TeamSchedule";
import { ActivityFeed } from "../components/user/ActivityFeed";
import { apiGetAthleteScheduleRows, apiGetTeamEvents } from "@/features/teams/api/teamSchedule.API";
import { EventWidget } from "../components/EventWidget";
import { getAllEvents } from "../api/dashboardApi";
import { useEffect, useState } from "react";
import { useAuth } from "@/shared/hooks/useAuth";
import type { TeamEvent } from "@/features/teams/types/event";

export const AdminDashboard = () => {
    const { token } = useAuth();
    const [events, setEvents] = useState<TeamEvent[]>([]);

    useEffect(() => {
        const fetchEvents = async () => {
            const data = await getAllEvents(token!);
            setEvents(data);
        };
        
        if (token) {
            fetchEvents();
        }
    }, [token]);

    return (
        <div className="flex flex-col gap-6 p-4">
            {events?
                events.map((event) => (
                    <div key={event.id} value={event.teamId}>
                        {event.teamId}
                        {event.name}
                    </div>
                ))
            :
                <div>No Pending Facility Requests</div>
            }
            
        </div>
    );
};


