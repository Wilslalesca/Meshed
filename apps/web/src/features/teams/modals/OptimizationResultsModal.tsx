
import { useEffect, useState } from "react";
import { TeamScheduleCalendar } from "../components/schedule/TeamScheduleCalendar"
import { startOfWeekISO, endOfWeekISO } from "../Services/isoRange";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle
} from "@/shared/components/ui/dialog";
import type { OptimizationResult } from "../types/OptimizationResult";
import { TeamScheduleMode, TeamScheduleView, type TeamScheduleEvent } from '../types/schedule';
import { useRoster } from "../hooks/useRoster";
import { useFilterOptimizedEvents } from "../hooks/useFilterOptimizedEvents";

export const OptimizeResultsModal = ({ open, onOpenChange,  teamId, optimizeResults }: { open: boolean; onOpenChange: (open: boolean) => void; teamId: string; optimizeResults: OptimizationResult | null }) => {
    const [range, onRangeChange] = useState({
        fromISO: startOfWeekISO(),
        toISO: endOfWeekISO(),
    });
    const [view, setView] = useState<TeamScheduleView>(TeamScheduleView.Week);
    const [mode, setMode] = useState<TeamScheduleMode>(TeamScheduleMode.Calendar);
    const [search, setSearch] = useState<string>("");
    const { roster } = useRoster(teamId!);
    const rosterCount = roster?.length ?? 0;
    
    const filteredEvents = useFilterOptimizedEvents(optimizeResults);


    return(
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent "fixed inset-0 translate-x-0 translate-y-0 w-full h-full max-w-none overflow-y-auto flex p-50">
                <DialogHeader>
                    <DialogTitle>Optimization Results</DialogTitle>
                </DialogHeader>
               { filteredEvents && (
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
                        onRangeChange={(fromISO: string, toISO: string) => onRangeChange({ fromISO, toISO })}
                    />
                ) }
            </DialogContent>

        </Dialog>
    );

};