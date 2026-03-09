import { useState } from "react";
import { TeamScheduleCalendar } from "../components/schedule/TeamScheduleCalendar";
import { startOfWeekISO, endOfWeekISO } from "../Services/isoRange";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/shared/components/ui/card";
import type { OptimizationResult } from "../types/OptimizationResult";
import { TeamScheduleMode, TeamScheduleView } from "../types/schedule";
import { useRoster } from "../hooks/useRoster";
import { useFilterOptimizedEvents } from "../hooks/useFilterOptimizedEvents";
import { OptimizeResultsTable } from "../components/add-event/OptimizedResultsTable";

export const OptimizeResultsPage = ({
    open,
    onOpenChange,
    teamId,
    optimizeResults,
}: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    teamId: string;
    optimizeResults: OptimizationResult | null;
}) => {
    const [range, onRangeChange] = useState({
        fromISO: startOfWeekISO(),
        toISO: endOfWeekISO(),
    });
    const [view, setView] = useState<TeamScheduleView>(TeamScheduleView.Week);
    const [mode, setMode] = useState<TeamScheduleMode>(
        TeamScheduleMode.Calendar,
    );
    const [search, setSearch] = useState<string>("");
    const { roster } = useRoster(teamId!);
    const rosterCount = roster?.length ?? 0;

    const filteredEvents = useFilterOptimizedEvents(optimizeResults);
    console.log(filteredEvents)

    return (
        <Card>
            <CardContent className="w-[94vw] max-w-none sm:max-w-none h-[93vh] max-h-[93vh] p-0 flex flex-col overflow-hidden">
                <CardHeader className="px-5 pt-5 pb-2">
                    <CardTitle>Optimization Results</CardTitle>
                </CardHeader>
                <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden px-5 pb-5">
                    {filteredEvents && (
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
                            rosterCount={rosterCount}
                            onRangeChange={(fromISO: string, toISO: string) =>
                                onRangeChange({ fromISO, toISO })
                            }
                        />
                    )}
                </div>
                 <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden px-5 pb-5">
                    <OptimizeResultsTable optimizeResults = {optimizeResults}/>
                 </div>
            </CardContent>
        </Card>
    );
};
