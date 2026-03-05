import { useState } from "react";
import { TeamScheduleCalendar } from "../components/schedule/TeamScheduleCalendar";
import { startOfWeekISO, endOfWeekISO } from "../Services/isoRange";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/shared/components/ui/dialog";
import type { OptimizationResult } from "../types/OptimizationResult";
import { TeamScheduleMode, TeamScheduleView } from "../types/schedule";
import { useRoster } from "../hooks/useRoster";
import { useFilterOptimizedEvents } from "../hooks/useFilterOptimizedEvents";

export const OptimizeResultsModal = ({
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

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="w-[94vw] max-w-none sm:max-w-none h-[93vh] max-h-[93vh] p-0 flex flex-col overflow-hidden">
                <DialogHeader className="px-5 pt-5 pb-2">
                    <DialogTitle>Optimization Results</DialogTitle>
                </DialogHeader>
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
            </DialogContent>
        </Dialog>
    );
};
