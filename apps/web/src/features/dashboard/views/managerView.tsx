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
import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/shared/hooks/useAuth";
import { apiGetMyTeams } from "@/features/teams/api/teams";
import type { Team } from "@/features/teams/types/teams";
import { useNotifications } from "@/features/notifications/hooks/useNotifications";
import { formatRelativeTime } from "../utils/notifications";
import { apiGetRoster } from "@/features/teams/api/teams";
import type { Athlete } from "@/features/teams/types/roster";
import { API_BASE } from "@/features/dashboard/api/userDashboard.api";
import type { RawTeamEvent } from "@/features/dashboard/types/api";
import { EventStatusDonut } from "../components/manager/PieChartEvents";
import { apiGetManagerDashboardStats } from "@/features/dashboard/api/managerDashboard.api";

export const ManagerView = () => {
    const { user, token } = useAuth();
    const [teams, setTeams] = useState<Team[]>([]);
    const [selectedTeam, setSelectedTeam] = useState<string>("");
    const {
        notifications,
        refresh: refreshNotifications,
    } = useNotifications();

    const [totalAthletes, setTotalAthletes] = useState<number>(0);
    const [totalTeamEvents, setTotalTeamEvents] = useState<number>(0);
    const [pendingApprovals, setPendingApprovals] = useState<number>(0);
    const [approvedEvents, setApprovedEvents] = useState<number>(0);
    const [deniedEvents, setDeniedEvents] = useState<number>(0);

    const getTeamEventsRaw = useCallback(
        async (teamId: string, authToken: string): Promise<RawTeamEvent[]> => {
            const res = await fetch(`${API_BASE}/teams/${teamId}/events`, {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                },
            });

            if (!res.ok) return [];

            const data = (await res.json()) as RawTeamEvent[];
            return Array.isArray(data) ? data : [];
        },
        [],
    );

    const loadStats = useCallback(async () => {
        if (!token || teams.length === 0) {
            setTotalAthletes(0);
            setTotalTeamEvents(0);
            setPendingApprovals(0);
            setApprovedEvents(0);
            setDeniedEvents(0);
            return;
        }
        const stats = await apiGetManagerDashboardStats(teams, token);

        try {
            const [rosters, teamEventLists] = await Promise.all([
                Promise.all(teams.map((t) => apiGetRoster(t.id, token))),
                Promise.all(teams.map((t) => getTeamEventsRaw(t.id, token))),
            ]);

            const athleteCount = rosters.reduce((sum, roster) => {
                const items = Array.isArray(roster) ? (roster as Athlete[]) : [];
                return sum + items.filter((a) => a.status === "active").length;
            }, 0);

            const totalEventsCount = teamEventLists.reduce(
                (sum, list) => sum + (Array.isArray(list) ? list.length : 0),
                0,
            );

            const pendingEventsCount = teamEventLists.reduce((sum, list) => {
                const items = Array.isArray(list) ? list : [];
                return (
                    sum +
                    items.filter((e) =>
                        String(e.status ?? "")
                            .trim()
                            .toLowerCase() === "pending",
                    ).length
                );
            }, 0);
            const approvedEventsCount = teamEventLists.reduce((sum, list) => {
                const items = Array.isArray(list) ? list : [];
                return (
                    sum +
                    items.filter(
                        (e) =>
                            String(e.status ?? "")
                                .trim()
                                .toLowerCase() === "approved",
                    ).length
                );
            }, 0);

            const deniedEventsCount = teamEventLists.reduce((sum, list) => {
                const items = Array.isArray(list) ? list : [];
                return (
                    sum +
                    items.filter((e) => {
                        const status = String(e.status ?? "").trim().toLowerCase();
                        return status === "denied" || status === "rejected";
                    }).length
                );
            }, 0);

            setTotalAthletes(athleteCount);
            setTotalTeamEvents(stats.totalTeamEvents);
            setPendingApprovals(stats.pendingEvents);
            setApprovedEvents(stats.approvedEvents);
            setDeniedEvents(stats.deniedEvents);
        } catch {
            setTotalAthletes(0);
            setTotalTeamEvents(0);
            setPendingApprovals(0);
            setApprovedEvents(0);
            setDeniedEvents(0);
        }
    }, [getTeamEventsRaw, teams, token]);

    useEffect(() => {
        let ignore = false;

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

    useEffect(() => {
        void loadStats();

        // Keep stats fresh as invites/approvals change.
        const id = window.setInterval(() => {
            void loadStats();
        }, 15_000);

        const onFocus = () => {
            void loadStats();
        };
        window.addEventListener("focus", onFocus);

        return () => {
            window.clearInterval(id);
            window.removeEventListener("focus", onFocus);
        };
    }, [loadStats]);

    useEffect(() => {
        if (!token || !user?.id) return;
        void refreshNotifications(10);
    }, [token, user?.id, refreshNotifications]);

    const updates = notifications.slice(0, 8).map((n) => ({
        user: n.type
            ? n.type.charAt(0).toUpperCase() + n.type.slice(1).toLowerCase()
            : "Meshed",
        action: n.message,
        time: formatRelativeTime(n.created_at),
    }));

    return (
        <div className="flex flex-col gap-6 p-6">
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

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <StatCard
                    title="Total Athletes"
                    value={String(totalAthletes)}
                    subtitle="Active athletes across your teams"
                />
                <StatCard
                    title="Total Team Events"
                    value={String(totalTeamEvents)}
                    subtitle="Total team events"
                />
                <StatCard
                    title="Pending Events"
                    value={String(pendingApprovals)}
                    subtitle="Pending team events"
                />
                
            </div>
             <QuickActions selectedTeamId={selectedTeam} />

            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="lg:col-span-2">
                    <Card className="h-full overflow-hidden">
                        <CardHeader>
                            <CardTitle>Recent Team Announcements</CardTitle>
                        </CardHeader>
                        <CardContent className="p-0 h-full">
                            <ActivityFeed data={updates} />
                        </CardContent>
                    </Card>
                </div>
                <div className="lg:col-span-1">
                    <EventStatusDonut
                        approved={approvedEvents}
                        pending={pendingApprovals}
                        denied={deniedEvents}
                    />
                </div>
            </div>
            <Card className="h-full">
                <TeamOverview
                    teams={teams}
                    selectedTeamId={selectedTeam}
                    onTeamChange={setSelectedTeam}
                />
            </Card>   
        </div>
    );
};
