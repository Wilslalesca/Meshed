import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { apiGetTeamById } from "@/features/teams/api/teams"
import { useEffect, useState } from "react";
import { useAuth } from "@/shared/hooks/useAuth";
import type { TeamEvent } from "@/features/teams/types/event";
import { getFacilityEvents, getStatusFacilityEvents, getConflictingFacilityEvents } from "../../api/dashboardApi";
import type { Team } from "@/features/teams/types/teams";
import { getTeamName } from "@/features/dashboard/helpers/getTeamName"
import { StatusModal } from "./StatusModal";
import { getRequestedByName } from "@/features/dashboard/helpers/getRequestedByName";
import type {CalendarEventItem} from "@/features/dashboard/types/eventItem"

export const IndividualFacilityEventCalendar = (
    { facilityId, facilityName, filter }:
    { facilityId: string; facilityName: string; filter:string }) => {
        const { token } = useAuth(); 
        const [events, setEvents] = useState<TeamEvent[]>([]);   
        const [allTeams, setAllTeams] = useState<Team[]>([]);
        const [isModalOpen, setIsModalOpen] = useState(false);
        const [selectedEvent, setSelectedEvent] = useState<TeamEvent | null>(null);
        const [selectedEventTeam, setSelectedEventTeam] = useState<string | null>(null);
        const [calendarEvents, setCalendarEvents] = useState<CalendarEventItem | null >(null);
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
                /*const tempCalendarEvents:CalendarEventItem = events.map((e) => ({
                    id : e.id,
                    title: getTeamName(e.teamId, allTeams),
                    day: e.dayOfWeek,
                    startTime: e.startTime,
                    endTime:e.endTime
                }))*/
                //setCalendarEvents()
            };
            fetchTeamsWithEvents();
        }, [token, events, allTeams]);

        /*export const func {
            setSelectedEvent(event);
            setSelectedEventTeam(getTeamName(event.teamId, allTeams));
            setIsModalOpen(true);
        }
    /*const calendarEvents = facilityEvents.map(event => ({
        id: event.id,
        title: event.title,
        daysOfWeek: [event.dayOfWeek],
        startTime: event.startTime,
        endTime: event.endTime
    }))*/

    return (
        <div>
            <FullCalendar
            plugins={[timeGridPlugin, interactionPlugin]}
            initialView="timeGridWeek"
            headerToolbar={false}
            allDaySlot={false}
            //events={calendarEvents}
            height="auto"
            />
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
        </div>
  )
}