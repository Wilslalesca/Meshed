import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/shared/components/ui/card";
import { QuickActions } from "../components/user/QuickActions";
import { StatCard } from "../components/StatCard";
import { ActivityFeed } from "../components/user/ActivityFeed";
import { useMemo, useState } from "react";
import { useAuth } from "@/shared/hooks/useAuth";
import { WeekHoursChart } from "../components/user/WeekHoursChart";
import { UpcomingEventsTable } from "../components/user/UpcomingEventsTable";
import { useUserDashboard } from "../hooks/useUserDashboard";
import {
    filterUpcomingTableEvents,
    getThisWeekCount,
    getTodayEvents,
    getUpcomingEvents,
    getUpcomingTableEvents,
    getWeeklyHoursData,
    toUpcomingEventRows,
} from "../utils/dashboardSelectors";
const todayIso = new Date().toISOString().split("T")[0];
import type { UpcomingEventFilter } from "../types/dashboard";

export const UserDashboard = () => {
    const { user, token } = useAuth();
    const [upcomingEventFilter, setUpcomingEventFilter] =
        useState<UpcomingEventFilter>("all");
    const { events, notifications, unreadCount, loading } = useUserDashboard(
        user?.id,
        token ?? undefined,
    );

    const upcomingEvents = useMemo(
        () => getUpcomingEvents(events, todayIso),
        [events, todayIso],
    );

    const todayEvents = useMemo(
        () => getTodayEvents(upcomingEvents, todayIso),
        [upcomingEvents, todayIso],
    );

    const thisWeekCount = useMemo(
        () => getThisWeekCount(upcomingEvents),
        [upcomingEvents],
    );

    const weeklyHoursData = useMemo(() => getWeeklyHoursData(events), [events]);

    const activityData = useMemo(() => {
        return notifications.map((item) => ({
            user: item.type
                ? item.type.charAt(0).toUpperCase() + item.type.slice(1)
                : "Meshed",
            text: item.text,
            time: item.time,
        }));
    }, [notifications]);

    const upcomingTableEvents = useMemo(
        () => getUpcomingTableEvents(events, todayIso),
        [events, todayIso],
    );

    const filteredUpcomingTableEvents = useMemo(
        () =>
            filterUpcomingTableEvents(upcomingTableEvents, upcomingEventFilter),
        [upcomingTableEvents, upcomingEventFilter],
    );

    const upcomingEventRows = useMemo(
        () => toUpcomingEventRows(filteredUpcomingTableEvents),
        [filteredUpcomingTableEvents],
    );

    return (
        <div className="flex flex-col gap-6 p-6">
            <div className="flex flex-col gap-1 px-1">
                <h1 className="text-2xl font-semibold tracking-tight">
                    Welcome back{user?.firstName ? `, ${user.firstName}` : ""}
                </h1>
                <p className="text-sm text-muted-foreground">
                    Here's a quick look at your upcoming schedule and team
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
                    title="Unread Notifications"
                    value={unreadCount}
                    subtitle="Notifications waiting for you"
                    loading={loading}
                />
            </div>

            <div className="grid grid-cols-1 gap-4 xl:grid-cols-4 xl:auto-rows-[360px]">
                <div className="xl:col-span-2 min-h-0">
                    <Card className="flex h-full min-h-0 flex-col">
                        <CardHeader>
                            <CardTitle>Recent Notifications</CardTitle>
                            <CardDescription>
                                Latest updates related to your schedule and
                                team.
                            </CardDescription>
                        </CardHeader>

                        <CardContent className="min-h-0 flex-1 overflow-y-auto no-scrollbar p-0">
                            <ActivityFeed data={activityData} />
                        </CardContent>
                    </Card>
                </div>

                <div className="xl:col-span-1 h-full">
                    <QuickActions />
                </div>

                <div className="xl:col-span-1">
                    <WeekHoursChart data={weeklyHoursData} />
                </div>
            </div>

            <Card className="flex flex-col">
                <CardHeader className="flex flex-row items-start justify-between gap-4">
                    <div>
                        <CardTitle>Upcoming Events</CardTitle>
                        <CardDescription>
                            All of your scheduled events and team activities
                            coming up.
                        </CardDescription>
                    </div>

                    <div className="flex gap-2 shrink-0">
                        {(
                            [
                                { value: "all", label: "All" },
                                { value: "today", label: "Today" },
                                { value: "week", label: "Week" },
                                { value: "schedule", label: "Schedule" },
                                { value: "team", label: "Team" },
                            ] as { value: UpcomingEventFilter; label: string }[]
                        ).map((option) => (
                            <button
                                key={option.value}
                                type="button"
                                onClick={() =>
                                    setUpcomingEventFilter(option.value)
                                }
                                className={`rounded-full border px-2 py-1 text-xs transition-colors ${
                                    upcomingEventFilter === option.value
                                        ? "border-primary bg-primary text-primary-foreground"
                                        : "border-border bg-background text-foreground hover:bg-muted"
                                }`}
                            >
                                {option.label}
                            </button>
                        ))}
                    </div>
                </CardHeader>

                <CardContent className="flex-1 overflow-y-auto max-h-[400px] no-scrollbar">
                    <UpcomingEventsTable data={upcomingEventRows} />
                </CardContent>
            </Card>
        </div>
    );
};
