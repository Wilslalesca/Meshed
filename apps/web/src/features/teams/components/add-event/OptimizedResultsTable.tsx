import { Button } from "@/shared/components/ui/button";
import type { OptimizationResult, AthleteMissesMap, OptimizationTeamEvent, OptimizedRow} from "../../types/OptimizationResult"
import { useAthleteByIds } from "../../hooks/useAthleteByIds";
import { useMemo, useState } from "react";

export const OptimizeResultsTable = ({
    optimizeResults,
    onCreateOptimizedEvent,
}: {
    optimizeResults: OptimizationResult | null;
     onCreateOptimizedEvent:(event:OptimizationTeamEvent)=>void;
}) => {
    //const [eventButton, setEventButton] = useState<number[]>([])
    const { rows, allMissingIds } = useMemo(() => {
        if (!optimizeResults) {
            return { rows: [], allMissingIds: [] };
        }

        const ids = new Set<string>();
        const rows: OptimizedRow[] = [];

        if (optimizeResults.type === "MAX_ATTENDANCE") {
            optimizeResults.result.forEach(event => {
                Object.keys(event.option.athletesMissing).forEach(id => ids.add(id));

                rows.push({
                    day: event.day,
                    start: event.option.start,
                    end: event.option.end,
                    athletesMissing: event.option.athletesMissing,
                    source: optimizeResults
                });
            });
        } else {
            optimizeResults.result.schedule.forEach(slot => {
                Object.keys(slot.athletesMissing).forEach(id => ids.add(id));

                rows.push({
                    day: "Monday", // temp
                    start: slot.start,
                    end: slot.end,
                    athletesMissing: slot.athletesMissing,
                    source: optimizeResults
                });
            });
        }

        return {
            rows,
            allMissingIds: Array.from(ids)
        };
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
                        {rows.map((event, index) => (
                                <tr key={index} className="border-b hover:bg-gray-50">
                                    <td className="py-2 px-4">{event.day}</td>
                                    <td className="py-2 px-4">{event.start}</td>
                                    <td className="py-2 px-4">{event.end}</td>
                                    <td className="py-2 px-4">{Object.keys(event.athletesMissing).length}</td>
                                    <td className="py-2 px-4">{renderNames(event.athletesMissing)}</td>
                                    <td className="py-2 px-4">
                                        <Button
                                            //disabled = {eventButton.has(index)}
                                            onClick={() =>
                                                onCreateOptimizedEvent({
                                                    dayOfWeek: event.day,
                                                    startTime: event.start,
                                                    endTime: event.end,
                                                })
                                                //setEventButton
                                            }>
                                            Add Event
                                        </Button>
                                    </td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
            </div>
    );
};