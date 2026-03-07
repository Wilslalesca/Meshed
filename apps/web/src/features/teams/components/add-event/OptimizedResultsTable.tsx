import { useEffect, useState } from "react";
import { useAuth } from "@/shared/hooks/useAuth";
import type { TeamEvent } from "@/features/teams/types/event";
import { getTeamName } from "@/features/dashboard/helpers/getTeamName"
import { getFacilityName } from "@/features/dashboard/helpers/getFacilityName"
import { Button } from "@/shared/components/ui/button";
import type { OptimizationResult } from "../../types/OptimizationResult"


export const OptimizeResultsTable = ({
    optimizeResults,
}: {
    optimizeResults: OptimizationResult | null;
}) => {
    const { token } = useAuth();

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
                    {optimizeResults.results.forEach((event) => (
                        <tr key={event.id} className="border-b hover:bg-gray-50">
                            <td className="py-2 px-4">{getTeamName(event.teamId, allTeams)}</td>
                            <td className="py-2 px-4">{event.name}</td>
                            <td className="py-2 px-4">{getFacilityName(event.teamFacilityId, allFacilities)}</td>
                            <td className="py-2 px-4">{new Date(event.startDate).toLocaleDateString()}</td>
                            <td className="py-2 px-4">{event.startTime}</td>
                            <td className="py-2 px-4">{event.endTime}</td>
                            <td className="py-2 px-4"><Button>Add Event</Button></td>
                        </tr>
                    ))}
                </tbody>
                </table>
            </div>
    );
};