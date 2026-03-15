
import { apiGetTeamById } from "@/features/teams/api/teams"
import { useEffect, useState } from "react";
import { useAuth } from "@/shared/hooks/useAuth";
import type { TeamEvent } from "@/features/teams/types/event";
import { getFacilityEvents, getStatusFacilityEvents, getConflictingFacilityEvents } from "../../api/dashboardApi";
import { Card, CardHeader, CardTitle, CardContent } from "@/shared/components/ui/card";
import type { Team } from "@/features/teams/types/teams";
import { getTeamName } from "@/features/dashboard/helpers/getTeamName"
import { Button } from "@/shared/components/ui/button";
import { StatusModal } from "./StatusModal";
import { getRequestedByName } from "@/features/dashboard/helpers/getRequestedByName";

export const IndividualFacilityEventTable = ({ facilityId, facilityName, filter }: { facilityId: string; facilityName: string; filter:string }) => {
    const { token } = useAuth(); 
    const [events, setEvents] = useState<TeamEvent[]>([]);   
    const [allTeams, setAllTeams] = useState<Team[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState<TeamEvent | null>(null);
    const [selectedEventTeam, setSelectedEventTeam] = useState<string | null>(null);
    const [refresh, setRefresh] = useState<number>(0)

     
    useEffect(() => {
        const fetchFacilityEvents = async () => {
            if (!token) return;

            let facilities: TeamEvent[] = [];

            if(filter == 'pending' || filter == 'approved' || filter == 'denied'){
                facilities = await getStatusFacilityEvents(facilityId, filter, token!);
            }
            else if(filter == 'conflicts'){
                facilities = await getConflictingFacilityEvents(facilityId, token!);
            }
            else {
                facilities = await getFacilityEvents(facilityId, token!);
            }
            setEvents(facilities ?? []);

        };

        fetchFacilityEvents();
    }, [token, facilityId, filter, refresh]);
    
    useEffect(() => {
        const fetchTeamsWithEvents = async () => {
            if (!token || events.length === 0) return;

            const uniqueTeamIds = [...new Set(events.map((e) => e.teamId).filter(Boolean))];
            const missingTeamIds = uniqueTeamIds.filter((teamId) => !allTeams.find((t) => t.id === teamId));
            
            if (missingTeamIds.length === 0) return;
            const teamResults = await Promise.all(missingTeamIds.map((teamId) => apiGetTeamById(teamId, token)));
            setAllTeams((prev) => [...prev, ...teamResults.filter(Boolean),]);
        };
        fetchTeamsWithEvents();
    }, [token, events, allTeams]);

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
                    <th className="text-left py-2 px-4">Booked For</th>
                    <th className="text-left py-2 px-4">Requested By</th>
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
                            <td className="py-2 px-4">{getTeamName(event.teamId, allTeams)}</td>
                            <td className="py-2 px-4">{getRequestedByName(event)}</td>
                            <td className="py-2 px-4">{event.name}</td>
                            <td className="py-2 px-4">{new Date(event.startDate).toLocaleDateString()}</td>
                            <td className="py-2 px-4">{event.startTime}</td>
                            <td className="py-2 px-4">{event.endTime}</td>
                            <td className="py-2 px-4">
                                <Button
                                 onClick={() => {
                                    setSelectedEvent(event);
                                    setSelectedEventTeam(getTeamName(event.teamId, allTeams));
                                    setIsModalOpen(true);
                                }}>
                                    {event.status}
                                </Button>
                            </td>
                        </tr>
                    ))
                    ) : (
                    <tr>
                        <td colSpan={7} className="py-4 px-4 text-center text-gray-500">
                        No {(filter != 'All' ? filter : '') } Facility Requests for {facilityName}
                        </td>
                    </tr>
                    )}
                </tbody>
                </table>
            </div>
            </CardContent>
            {selectedEvent && (
                <StatusModal
                    open={isModalOpen}
                    onOpenChange={setIsModalOpen}
                    eventInfo={selectedEvent}
                    teamName={selectedEventTeam ?? undefined}
                    onAdded={() => {
                        setRefresh((prev) => prev + 1)
                    }}
                />
            )}
        </Card>
        
    );
};


