import { Card, CardHeader, CardTitle, CardContent } from "@/shared/components/ui/card";
import { apiGetEventFacilities } from "@/features/teams/api/events"
import type { Facility } from "@/features/facilities/types/facilities";
import { getAllEvents } from "../../api/dashboardApi"
import { useEffect, useState } from "react";
import { useAuth } from "@/shared/hooks/useAuth";
import type { TeamEvent } from "@/features/teams/types/event";

export const AllEventTable = () => {
    const { token } = useAuth();
    const [events, setEvents] = useState<TeamEvent[]>([]);

    useEffect(() => {
        const fetchEvents = async () => {
            const data = await getAllEvents(token!);
            setEvents(data);
        };
        
        if (token) {
            fetchEvents();
        }
    }, [token]);

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
                    <th className="text-left py-2 px-4">Team ID</th>
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
                        <td className="py-2 px-4">{event.teamId}</td>
                        <td className="py-2 px-4">{event.name}</td>
                        <td className="py-2 px-4">{event.teamFacilityId}</td>
                        <td className="py-2 px-4">{new Date(event.startDate).toLocaleDateString()}</td>
                        <td className="py-2 px-4">{event.startTime}</td>
                        <td className="py-2 px-4">{event.endTime}</td>
                        <td className="py-2 px-4">{event.status}</td>
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
        </Card>
    );
};