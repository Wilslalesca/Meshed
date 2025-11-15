import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/shared/components/ui/card";
import { QuickActions } from "../components/manager/QuickActions";
import { StatCard } from "../components/StatCard";
import { TeamOverview } from "../components/manager/TeamOverview";
import { ActivityFeed } from "../components/manager/ActivityFeed";
import { EventWidget } from "../components/EventWidget";
import { useEffect, useState } from "react";
import { useAuth } from "@/shared/hooks/useAuth";

export const ManagerView = () => {
    const { user } = useAuth();
    const [events, setEvents] = useState([]);
    const [teams, setTeams] = useState([]);
    const [selectedTeam, setSelectedTeam] = useState<string>("");

    useEffect(() => {
        setEvents([]);
        setTeams([]);
        setSelectedTeam("");
    }, [user?.id]);

    return (
        <div className="flex flex-col gap-6 p-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                    title="Total Athletes"
                    value="—"
                    subtitle="No API connection"
                />
                <StatCard
                    title="Avg Attendance"
                    value="—"
                    subtitle="No API connection"
                />
                <StatCard
                    title="Pending Approvals"
                    value="—"
                    subtitle="No API connection"
                />
                <StatCard
                    title="Unread Messages"
                    value="—"
                    subtitle="No API connection"
                />
            </div>

            <QuickActions />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="flex flex-col gap-4 lg:col-span-2">
                    <Card className="h-full">
                        <TeamOverview
                            teams={teams}
                            selectedTeamId={selectedTeam}
                            onTeamChange={setSelectedTeam}
                        />
                    </Card>

                    <Card className="h-full">
                        <CardHeader>
                            <CardTitle>Updates</CardTitle>
                        </CardHeader>
                        <CardContent className="p-0 h-full">
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
