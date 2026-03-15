import { Card, CardHeader, CardTitle, CardContent } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { useEffect, useState } from "react";
import { useAuth } from "@/shared/hooks/useAuth";

import type { Facility } from "@/features/facilities/types/facilities";
import type { Team } from "@/features/teams/types/teams";
import type { TeamEvent } from "@/features/teams/types/event";

import { StatusModal } from "./StatusModal";

import { getFacilityName } from "@/features/dashboard/helpers/getFacilityName";
import { getTeamName } from "@/features/dashboard/helpers/getTeamName";
import { getRequestedByName } from "@/features/dashboard/helpers/getRequestedByName";

import { apiGetEventFacilities } from "@/features/teams/api/events";
import { apiGetTeamById } from "@/features/teams/api/teams";
import { getAllEvents } from "../../api/dashboardApi";

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
        
        fetchEvents();
    }, [token, refresh]);

    useEffect(() => {
        const fetchTeamsWithEvents = async () => {
            if (!token || events.length === 0) return;

            const uniqueTeamIds = [...new Set(events.map(e => e.teamId))];
            const missingTeamIds = uniqueTeamIds.filter(teamId => !allTeams.find(t => t.id === teamId));

            if (missingTeamIds.length === 0) return;
            const teamResults = await Promise.all(missingTeamIds.map(teamId => apiGetTeamById(teamId, token)));

            setAllTeams(prev => [...prev, ...teamResults]);
        };
        fetchTeamsWithEvents();
    }, [token, events, allTeams]);

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
                    <th className="text-left py-2 px-4">Booked For</th>
                    <th className="text-left py-2 px-4">Requested By</th>
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
                            <td className="py-2 px-4">{getRequestedByName(event)}</td>
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
                        <td colSpan={8} className="py-4 px-4 text-center text-gray-500">
                            No Facility Requests
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
                    teamName={selectedEventTeam ?? ""}
                    onAdded={() => {
                        setRefresh((prev) => prev +1)
                    }}
                />
            )}
        </Card>
    );
};