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
import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/shared/hooks/useAuth";
import { apiGetMyTeams } from "@/features/teams/api/teams";
import type { Team } from "@/features/teams/types/teams";
import { useNotifications } from "@/features/notifications/hooks/useNotifications";
import { formatRelativeTime } from "../utils/notifications";
import { apiGetRoster } from "@/features/teams/api/teams";
import type { Athlete } from "@/features/teams/types/roster";
import { apiGetStaff } from "@/features/teams/api/staff";
import type { StaffMember } from "@/features/teams/types/staff";

export const ManagerView = () => {
    const { user, token } = useAuth();
    const [events, setEvents] = useState([]);
    const [teams, setTeams] = useState<Team[]>([]);
    const [selectedTeam, setSelectedTeam] = useState<string>("");
    const {
        notifications,
        refresh: refreshNotifications,
    } = useNotifications();

    const [totalAthletes, setTotalAthletes] = useState<number>(0);
    const [pendingApprovals, setPendingApprovals] = useState<number>(0);

    const loadStats = useCallback(async () => {
        if (!token || teams.length === 0) {
            setTotalAthletes(0);
            setPendingApprovals(0);
            return;
        }

        try {
            const [rosters, staffLists] = await Promise.all([
                Promise.all(teams.map((t) => apiGetRoster(t.id, token))),
                Promise.all(teams.map((t) => apiGetStaff(t.id, token))),
            ]);

            const athleteCount = rosters.reduce((sum, roster) => {
                const items = Array.isArray(roster) ? (roster as Athlete[]) : [];
                return sum + items.filter((a) => a.status === "active").length;
            }, 0);

            const pendingRosterCount = rosters.reduce((sum, roster) => {
                const items = Array.isArray(roster) ? (roster as Athlete[]) : [];
                return sum + items.filter((a) => a.status === "pending").length;
            }, 0);

            const pendingStaffCount = staffLists.reduce((sum, staff) => {
                const items = Array.isArray(staff)
                    ? (staff as StaffMember[])
                    : [];
                return sum + items.filter((s) => s.status === "pending").length;
            }, 0);

            setTotalAthletes(athleteCount);
            setPendingApprovals(pendingRosterCount + pendingStaffCount);
        } catch {
            setTotalAthletes(0);
            setPendingApprovals(0);
        }
    }, [teams, token]);

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
                        value={String(totalAthletes)}
                        subtitle="Active athletes across your teams"
                    />
                    <StatCard
                        title="Avg Attendance"
                        value="—"
                        subtitle="Not tracked yet"
                    />
                    <StatCard
                        title="Pending Approvals"
                        value={String(pendingApprovals)}
                        subtitle="Pending users"
                    />
                    {/* removed as unimplemented / unnecessary atm */}
                    {/* <StatCard
                        title="Unread Messages"
                        value={String(unreadCount)}
                        subtitle="Unread notifications"
                    /> */}
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
                                <ActivityFeed data={updates} />
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
