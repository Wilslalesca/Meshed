import {
    CardHeader,
    CardTitle,
    CardContent,
} from "@/shared/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";
import { useMemo, useState } from "react";
import type { Team } from "@/features/teams/types/teams";
import { useRoster } from "@/features/teams/hooks/useRoster";
import { TeamRosterTab } from "@/features/teams/components/tabs/TeamRosterTab";
import { TeamScheduleCalendar } from "@/features/teams/components/schedule/TeamScheduleCalendar";
import { TeamScheduleMode, TeamScheduleView } from "@/features/teams/types/schedule";
import { startOfWeekISO, endOfWeekISO } from "@/features/teams/Services/isoRange";
import { useTeamSchedule } from "@/features/teams/hooks/useTeamSchedule";

export const TeamOverview = ({
    teams,
    selectedTeamId,
}: {
    teams: Team[];
    selectedTeamId: string;
}) => {
    const selected = teams.find((t) => t.id === selectedTeamId);
    const [tab, setTab] = useState<"roster" | "calendar">("roster");
    const [range, setRange] = useState({
        fromISO: startOfWeekISO(),
        toISO: endOfWeekISO(),
    });

    const { roster, loading: rosterLoading, removeAthlete } = useRoster(selectedTeamId);
    const { events, loading: scheduleLoading, error } = useTeamSchedule(
        selectedTeamId,
        range.fromISO,
        range.toISO,
    );

    const [view, setView] = useState<TeamScheduleView>(TeamScheduleView.Week);
    const [mode, setMode] = useState<TeamScheduleMode>(TeamScheduleMode.Calendar);
    const [search, setSearch] = useState<string>("");

    const filteredEvents = useMemo(() => {
        const query = search.trim().toLowerCase();
        if (!query) return events;

        return events.filter(
            (e) =>
                e.title.toLowerCase().includes(query) ||
                e.athleteName.toLowerCase().includes(query),
        );
    }, [events, search]);

    return (
        <>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle>Your Team</CardTitle>
            </CardHeader>

            <CardContent className="space-y-3">
                <Tabs
                    value={tab}
                    onValueChange={(v: string) =>
                        setTab(v as "roster" | "calendar")
                    }
                >
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="roster">Roster</TabsTrigger>
                        <TabsTrigger value="calendar">Calendar</TabsTrigger>
                    </TabsList>

                    <TabsContent value="roster" className="pt-2">
                        {!teams || teams.length === 0 ? (
                            <div className="min-h-[230px] flex items-center justify-center text-muted-foreground">
                                No team data available.
                            </div>
                        ) : !selected ? (
                            <div className="min-h-[230px] flex items-center justify-center text-muted-foreground">
                                Select a team to view roster.
                            </div>
                        ) : rosterLoading ? (
                            <div className="text-sm text-muted-foreground">
                                Loading roster...
                            </div>
                        ) : (
                            <TeamRosterTab
                                roster={roster}
                                viewMode="table"
                                onRemoveAthlete={(id) => removeAthlete?.(id)}
                            />
                        )}
                    </TabsContent>

                    <TabsContent value="calendar" className="pt-2">
                        {!teams || teams.length === 0 ? (
                            <div className="min-h-[230px] flex items-center justify-center text-muted-foreground">
                                No team data available.
                            </div>
                        ) : !selected ? (
                            <div className="min-h-[230px] flex items-center justify-center text-muted-foreground">
                                Select a team to view calendar.
                            </div>
                        ) : (
                            <>
                                {error && (
                                    <div className="text-sm text-destructive">
                                        Something went wrong: {error}
                                    </div>
                                )}
                                {scheduleLoading ? (
                                    <div className="text-sm text-muted-foreground">
                                        Loading schedule...
                                    </div>
                                ) : (
                                    <TeamScheduleCalendar
                                        view={view}
                                        setView={setView}
                                        events={filteredEvents}
                                        mode={mode}
                                        setMode={setMode}
                                        search={search}
                                        setSearch={setSearch}
                                        fromISO={range.fromISO}
                                        toISO={range.toISO}
                                        rosterCount={roster.length}
                                        onRangeChange={(fromISO, toISO) =>
                                            setRange({ fromISO, toISO })
                                        }
                                    />
                                )}
                            </>
                        )}
                    </TabsContent>
                </Tabs>
            </CardContent>
        </>
    );
};
