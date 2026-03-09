import { Button } from "@/shared/components/ui/button";
import type { OptimizationResult, AthleteMissesMap, OptimizationTeamEvent} from "../../types/OptimizationResult"
import { useAthleteByIds } from "../../hooks/useAthleteByIds";
import { useMemo } from "react";

export const OptimizeResultsTable = ({
    optimizeResults,
    onCreateOptimizedEvent,
}: {
    optimizeResults: OptimizationResult | null;
     onCreateOptimizedEvent:(event:OptimizationTeamEvent)=>void;
}) => {
    
    const allMissingIds = useMemo(() => {
        if (!optimizeResults?.result) return [];
        
        const ids = new Set<string>();
        if(optimizeResults.type == "MAX_ATTENDANCE"){
            optimizeResults.result.forEach(event => {
                Object.keys(event.option.athletesMissing).forEach(id => {
                    ids.add(id);
                });
            });
        }
        else{
            optimizeResults.result.schedule.map(event => {
                Object.keys(event.athletesMissing).forEach(id => {
                    ids.add(id);
                });
            });
        }

        return Array.from(ids);
    }, [optimizeResults]);

    const athletes = (useAthleteByIds(allMissingIds)).athletes;
        const athletesById = useMemo(() => {
        const map: Record<string, { first_name: string; id: string }> = {};
        athletes?.forEach(athlete => {
            map[athlete.id] = athlete;
        });
        return map;
    }, [athletes]);

    const renderNames = (map: AthleteMissesMap) =>
    Object.keys(map)
      .map(id => athletesById[id]?.first_name ?? "Unknown")
      .join(", ");

    return (
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="border-b">
                        <th className="text-left py-2 px-4">Day of the Week</th>
                        <th className="text-left py-2 px-4">Start Time</th>
                        <th className="text-left py-2 px-4">End Time</th>
                        <th className="text-left py-2 px-4">Absenses</th>
                        <th className="text-left py-2 px-4">Athletes Missing</th>
                        <th className="text-left py-2 px-4">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {optimizeResults?.type === "MAX_ATTENDANCE" ? (
                            optimizeResults?.result.map((event, index) => (
                                <tr key={index} className="border-b hover:bg-gray-50">
                                    <td className="py-2 px-4">{event.day}</td>
                                    <td className="py-2 px-4">{event.option.start}</td>
                                    <td className="py-2 px-4">{event.option.end}</td>
                                    <td className="py-2 px-4">{Object.keys(event.option.athletesMissing).length}</td>
                                    <td className="py-2 px-4">{renderNames(event.option.athletesMissing)}</td>
                                    <td className="py-2 px-4">
                                        <Button
                                         onClick={() =>
                                            onCreateOptimizedEvent({
                                                dayOfWeek: event.day,
                                                startTime: event.option.start,
                                                endTime: event.option.end,
                                            })
                                        }>
                                            Add Event
                                        </Button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            optimizeResults?.result.schedule.map((slot, index) => (
                                <tr key={index} className="border-b hover:bg-gray-50">
                                    <td className="py-2 px-4">-</td> {/* ScheduleSlot has no 'day' */}
                                    <td className="py-2 px-4">{slot.start}</td>
                                    <td className="py-2 px-4">{slot.end}</td>
                                    <td className="py-2 px-4">{Object.keys(slot.athletesMissing).length}</td>
                                    <td className="py-2 px-4">{renderNames(slot.athletesMissing)}</td>
                                    <td className="py-2 px-4">
                                        <Button
                                         onClick={() =>
                                            onCreateOptimizedEvent({
                                                dayOfWeek: "",
                                                startTime: slot.start,
                                                endTime: slot.end,
                                            })
                                        }>
                                            Add Event
                                        </Button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
    );
};