import { OptimizedScheduleCalendar } from "../components/schedule/OptimizedScheduleCalendar";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/shared/components/ui/dialog";
import type { OptimizationResult, OptimizationTeamEvent } from "../types/OptimizationResult";
import { useFilterOptimizedEvents } from "../hooks/useFilterOptimizedEvents";
import { OptimizeResultsTable } from "../components/add-event/OptimizedResultsTable";

export const OptimizeResultsModal = ({
    open,
    onOpenChange,
    optimizeResults,
    onCreateOptimizedEvent,
}: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    optimizeResults: OptimizationResult | null;
    onCreateOptimizedEvent:(event:OptimizationTeamEvent)=>void;
}) => {

    const filteredEvents = useFilterOptimizedEvents(optimizeResults);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="w-[94vw] max-w-none sm:max-w-none h-[93vh] max-h-[93vh] p-0 flex flex-col overflow-hidden">
                <DialogHeader className="px-5 pt-5 pb-2">
                    <DialogTitle>Optimization Results</DialogTitle>
                </DialogHeader>
                <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden px-5 pb-5">
                    {filteredEvents ? (
                        <OptimizedScheduleCalendar
                           optimizedEvents={filteredEvents}
                        />
                    ):(
                        <div>No Optimized Events</div>
                    )}
                </div>
                 <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden px-5 pb-5">
                    <OptimizeResultsTable optimizeResults = {optimizeResults} onCreateOptimizedEvent = {onCreateOptimizedEvent}/>
                 </div>
            </DialogContent>
        </Dialog>
    );
};
