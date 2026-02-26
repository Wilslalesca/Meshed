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
import { EventWidget } from "../components/EventWidget";
import { getAthleteEvents } from "../api/dashboardApi";
import { useEffect, useState } from "react";
import { useAuth } from "@/shared/hooks/useAuth";

export const UserDashboard = () => {
    const [events, setEvents] = useState<
        Array<{ id: string; title: string; date: string; time: string }>
    >([]);
    const { user } = useAuth();
    const { token } = useAuth();
    useEffect(() => {
        if (user?.id) {
            getAthleteEvents(user.id, token!).then(setEvents);
        }
    }, [user?.id, token]);

    return (
        <div className="flex flex-col gap-6 p-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                    title="Upcoming Classes"
                    value={null}
                    subtitle="No API connection"
                    loading={false}
                />
                <StatCard
                    title="Training Sessions"
                    value={null}
                    subtitle="No API connection"
                    loading={false}
                />
                <StatCard
                    title="Available Facilities"
                    value={null}
                    subtitle="No API connection"
                    loading={false}
                />
                <StatCard
                    title="Unread Messages"
                    value={null}
                    subtitle="No API connection"
                    loading={false}
                />
            </div>

            <QuickActions />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="flex flex-col gap-4 lg:col-span-2">
                    <Card className="h-full">
                        <CardHeader>
                            <CardTitle>Your Team</CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            <TeamSchedule data={[]} />
                        </CardContent>
                    </Card>

                    <Card className="h-full">
                        <CardHeader>
                            <CardTitle>Updates</CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            <ActivityFeed data={[]} />
                        </CardContent>
                    </Card>
                </div>

                <div className="lg:col-span-1 flex flex-col gap-4">
                    <EventWidget events={events} />
                </div>
            </div>
        </div>
    );
};
