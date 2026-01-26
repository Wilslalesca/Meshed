
import type { Facility } from "@/features/facilities/types/facilities";
import { useEffect, useState } from "react";
import { useAuth } from "@/shared/hooks/useAuth";
import type { TeamEvent } from "@/features/teams/types/event";
import { getFacilityEvents, getStatusFacilityEvents, getConflictingFacilityEvents } from "../../api/dashboardApi";
import { Card, CardHeader, CardTitle, CardContent } from "@/shared/components/ui/card";

export const IndividualFacilityEventTable = ({ facilityId, facilityName, filter }: { facilityId: string; facilityName: string; filter:string }) => {
    const { token } = useAuth(); 
    const [events, setEvents] = useState<TeamEvent[]>([]);    
    
    useEffect(() => {
        const fetchFacilityEvents = async () => {
            let facilities: TeamEvent[] = [];

            if(filter == 'pending' || filter == 'confirmed'){
                facilities = await getStatusFacilityEvents(facilityId, filter, token!);
            }
            else if(filter == 'conflicts'){
                facilities = await getConflictingFacilityEvents(facilityId, token!);
            }
            else {
                facilities = await getFacilityEvents(facilityId, token!);
            }

            if (facilities) {
                setEvents(facilities);
            }
        };

        fetchFacilityEvents();
    }, [token, facilityId, filter]);
    

    return (
        <Card>
            <CardHeader>
            <CardTitle>{facilityName}</CardTitle>
            </CardHeader>
            <CardContent>
            <div className="overflow-x-auto">
                <table className="w-full">
                <thead>
                    <tr className="border-b">
                    <th className="text-left py-2 px-4">Team ID</th>
                    <th className="text-left py-2 px-4">Event Name</th>
                    <th className="text-left py-2 px-4">Date</th>
                    <th className="text-left py-2 px-4">Start Time</th>
                    <th className="text-left py-2 px-4">End Time</th>
                    <th className="text-left py-2 px-4">Status</th>
                    </tr>
                </thead>
                <tbody>
                    {events.length > 0 ? (
                    events.map((event) => (
                        <tr key={event.id} className="border-b hover:bg-gray-50">
                        <td className="py-2 px-4">{event.teamId}</td>
                        <td className="py-2 px-4">{event.name}</td>
                        <td className="py-2 px-4">{new Date(event.startDate).toLocaleDateString()}</td>
                        <td className="py-2 px-4">{event.startTime}</td>
                        <td className="py-2 px-4">{event.endTime}</td>
                        <td className="py-2 px-4">{event.status}</td>
                        </tr>
                    ))
                    ) : (
                    <tr>
                        <td colSpan={2} className="py-4 px-4 text-center text-gray-500">
                        No {(filter != 'All' ? filter : '') } Facility Requests for {facilityName}
                        </td>
                    </tr>
                    )}
                </tbody>
                </table>
            </div>
            </CardContent>
        </Card>
    );
};


