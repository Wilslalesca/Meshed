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
import { apiGetMyTeams } from "@/features/teams/api/teams";
import type { Team } from "@/features/teams/types/teams";

export const ManagerView = () => {
    const { user, token } = useAuth();
    const [events, setEvents] = useState([]);
    const [teams, setTeams] = useState<Team[]>([]);
    const [selectedTeam, setSelectedTeam] = useState<string>("");

    useEffect(() => {
        let ignore = false;

        setEvents([]);
        setTeams([]);
        setSelectedTeam("");

        const loadTeams = async () => {
            if (!token) return;
            const mine = await apiGetMyTeams(token);
            if (ignore) return;
            setTeams(mine);
            if (mine.length > 0) setSelectedTeam(mine[0]!.id);
        };

        void loadTeams();

        return () => {
            ignore = true;
        };
    }, [user?.id, token]);

    return (
        <div className="p-6">
            <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
                <div className="flex flex-col gap-1 px-1">
                    <h1 className="text-2xl font-semibold tracking-tight">
                        Welcome back
                        {user?.firstName ? `, ${user.firstName}` : ""}
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Here's a quick look at your teams, approvals, and
                        schedule updates.
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
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

                <QuickActions selectedTeamId={selectedTeam} />

                <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
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

                    <div className="flex flex-col gap-4 lg:col-span-1">
                        <EventWidget events={events} />
                    </div>
                </div>
            </div>
        </div>
    );
};
