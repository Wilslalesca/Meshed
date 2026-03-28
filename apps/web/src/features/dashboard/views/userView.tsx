import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/shared/components/ui/card";
import { QuickActions } from "../components/user/QuickActions";
import { StatCard } from "../components/StatCard";
import { TeamSchedule } from "../components/user/TeamSchedule";
import { ActivityFeed } from "../components/user/ActivityFeed";
import { EventWidget } from "../components/EventWidget";
import { getAthleteEvents } from "../api/dashboardApi";
import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/shared/hooks/useAuth";

type DashboardEvent = {
    id: string;
    title: string;
    date: string;
    time: string;
};

export const UserDashboard = () => {
    const [events, setEvents] = useState<DashboardEvent[]>([]);
    const [loading, setLoading] = useState(true);
    const { user, token } = useAuth();

    useEffect(() => {
        const loadEvents = async () => {
            if (!user?.id || !token) return;

            try {
                setLoading(true);
                const data = await getAthleteEvents(user.id, token);
                setEvents(data);
            } finally {
                setLoading(false);
            }
        };

        loadEvents();
    }, [user?.id, token]);

    const todayIso = new Date().toISOString().split("T")[0];

    const upcomingEvents = useMemo(() => {
        return events
            .filter((event) => event.date >= todayIso)
            .sort((a, b) =>
                `${a.date} ${a.time}`.localeCompare(`${b.date} ${b.time}`),
            );
    }, [events, todayIso]);

    const todayEvents = useMemo(() => {
        return upcomingEvents.filter((event) => event.date === todayIso);
    }, [upcomingEvents, todayIso]);

    const nextEvent = upcomingEvents[0] ?? null;

    const thisWeekCount = useMemo(() => {
        const now = new Date();
        const next7 = new Date();
        next7.setDate(now.getDate() + 7);

        return events.filter((event) => {
            const eventDate = new Date(event.date);
            return eventDate >= now && eventDate <= next7;
        }).length;
    }, [events]);

    const teamScheduleData = todayEvents.map((event) => ({
        time: event.time,
        event: event.title,
        location: "Facility TBA",
    }));

    const activityData = [
        nextEvent
            ? {
                  user: "Meshed",
                  text: `Your next event is ${nextEvent.title}.`,
                  time: `${nextEvent.date} • ${nextEvent.time}`,
              }
            : null,
        {
            user: "Coach",
            text: "Check your weekly schedule and upcoming events.",
            time: "Today",
        },
    ].filter(Boolean) as { user: string; text: string; time: string }[];

    return (
        <div className="flex flex-col gap-6 p-6">
            <div className="flex flex-col gap-1 px-1">
                <h1 className="text-2xl font-semibold tracking-tight">
                    Welcome back{user?.firstName ? `, ${user.firstName}` : ""}
                </h1>

                <p className="text-sm text-muted-foreground">
                    Here’s a quick look at your upcoming schedule and team
                    activity.
                </p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <StatCard
                    title="Upcoming Events"
                    value={upcomingEvents.length}
                    subtitle="All scheduled from today onward"
                    loading={loading}
                />
                <StatCard
                    title="Today"
                    value={todayEvents.length}
                    subtitle="Events scheduled for today"
                    loading={loading}
                />
                <StatCard
                    title="This Week"
                    value={thisWeekCount}
                    subtitle="Events in the next 7 days"
                    loading={loading}
                />
                <StatCard
                    title="Next Event"
                    value={nextEvent ? nextEvent.time : "—"}
                    subtitle={nextEvent ? nextEvent.title : "No upcoming event"}
                    loading={loading}
                />
            </div>
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                <Card className="h-full">
                    <CardHeader>
                        <CardTitle>Recent Updates</CardTitle>
                        <CardDescription>
                            Latest activity related to your schedule and team.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="p-0">
                        <ActivityFeed data={activityData} />
                    </CardContent>
                </Card>

                <QuickActions />
            </div>

            <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
                <div className="xl:col-span-2">
                    <Card className="h-full">
                        <CardHeader>
                            <CardTitle>Today’s Schedule</CardTitle>
                            <CardDescription>
                                Your next practices, games, and team events.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="p-0">
                            <TeamSchedule data={teamScheduleData} />
                        </CardContent>
                    </Card>
                </div>

                <div className="xl:col-span-1">
                    <EventWidget events={events} />
                </div>
            </div>
        </div>
    );
};
