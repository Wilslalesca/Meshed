
import { useState } from "react";
import { TeamScheduleTab } from "../components/tabs/TeamScheduleTab";
import { startOfWeekISO, endOfWeekISO } from "../Services/isoRange";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle
} from "@/shared/components/ui/dialog";
import type { OptimizationResult } from "../types/OptimizationResult";

export const OptimizeResultsModal = ({ open, onOpenChange,  teamId, optimizeResults }: { open: boolean; onOpenChange: (open: boolean) => void; teamId: string; optimizeResults: OptimizationResult | null }) => {
    const [range, setRange] = useState({
        fromISO: startOfWeekISO(),
        toISO: endOfWeekISO(),
    });
    //const {events, reload: reloadSchedule} = useTeamSchedule(teamId!,range.fromISO,range.toISO )
    const {events, setEvents} = useState
    return(
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md max-h-150 overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Optimization Results</DialogTitle>
                </DialogHeader>
            <TeamScheduleTab
                events={events}
                range={range}
                onRangeChange={setRange}
                onReload={setEvents}
            />
            </DialogContent>

        </Dialog>
    );

};