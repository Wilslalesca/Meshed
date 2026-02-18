import { Card, CardHeader, CardTitle, CardContent } from "@/shared/components/ui/card";
import { apiGetEventFacilities } from "@/features/teams/api/events"
import { apiGetTeamById } from "@/features/teams/api/teams"
import type { Facility } from "@/features/facilities/types/facilities";
import { getAllEvents } from "../../api/dashboardApi"
import { useEffect, useState } from "react";
import { useAuth } from "@/shared/hooks/useAuth";
import type { TeamEvent } from "@/features/teams/types/event";
import type { Team } from "@/features/teams/types/teams";
import { getTeamName } from "@/features/dashboard/helpers/getTeamName"
import { getFacilityName } from "@/features/dashboard/helpers/getFacilityName"
import { Button } from "@/shared/components/ui/button";
import { StatusModal } from "./StatusModal";


export const AllEventTable = () => {
    const { token } = useAuth();
    const [events, setEvents] = useState<TeamEvent[]>([]);
    const [allFacilities, setAllFacilities] = useState<Facility[]>([]);
    const [allTeams, setAllTeams] = useState<Team[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState<TeamEvent | null>(null);
    const [selectedEventTeam, setSelectedEventTeam] = useState<string | null>(null);
    const [refresh, setRefresh] = useState<number>(0)

    useEffect(() => {
        const fetchFacilities = async () => {
            if (!token) return;
            const facilities = await apiGetEventFacilities(token);
            if (facilities) {
                setAllFacilities(facilities);
            }
        };

        fetchFacilities();
    }, [token]);

    useEffect(() => {
        const fetchEvents = async () => {
            if (!token) return;
            const data = await getAllEvents(token);
            setEvents(data);
        };
        
        if (token) {
            fetchEvents();
        }
    }, [token, refresh]);

    useEffect(() => {
        const fetchTeamsWithEvents = async () => {
            if (!token || events.length === 0) return;
            const uniqueTeamIds = [...new Set(events.map(e => e.teamId))];
            for (const teamId of uniqueTeamIds) {

                if (!allTeams.find(t => t.id === teamId)) {
                    const data = await apiGetTeamById(teamId, token);
                    setAllTeams(prev => [...prev, data]);
                }
            }
        };
        fetchTeamsWithEvents();
    })

    return (
        <Card>
            <CardHeader>
            <CardTitle>All Facility Requests</CardTitle>
            </CardHeader>
            <CardContent>
            <div className="overflow-x-auto">
                <table className="w-full">
                <thead>
                    <tr className="border-b">
                    <th className="text-left py-2 px-4">Team</th>
                    <th className="text-left py-2 px-4">Event Name</th>
                    <th className="text-left py-2 px-4">Facility</th>
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
                            <td className="py-2 px-4">{event.name}</td>
                            <td className="py-2 px-4">{getFacilityName(event.teamFacilityId, allFacilities)}</td>
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
                        <td colSpan={2} className="py-4 px-4 text-center text-gray-500">
                        No Pending Facility Requests
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
                    teamName={selectedEventTeam}
                    onAdded={() => {
                        setRefresh(refresh+1)
                    }}
                />
            )}
        </Card>
    );
};