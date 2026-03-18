import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { apiGetTeamById } from "@/features/teams/api/teams"
import { useEffect, useState } from "react";
import { useAuth } from "@/shared/hooks/useAuth";
import type { TeamEvent } from "@/features/teams/types/event";
import { getFacilityEvents, getStatusFacilityEvents, getConflictingFacilityEvents } from "../../api/dashboardApi";
import type { Team } from "@/features/teams/types/teams";
import { getTeamName } from "@/features/dashboard/helpers/getTeamName"
import { StatusModal } from "./StatusModal";
import type {FacilityCalendarItem} from "@/features/dashboard/types/eventItem"
import type { EventClickArg } from '@fullcalendar/core';
import { Search, X, ArrowLeft, ArrowRight } from 'lucide-react';
import { ButtonGroup } from "@/shared/components/ui/button-group";
import { Button } from '@/shared/components/ui/button';
import type { CalendarApi } from '@fullcalendar/core';

function getMonthDayChip(api: CalendarApi | null) {
  if (!api) return { month: "", day: "" };

  const d = api.getDate(); 
  const month = d.toLocaleString(undefined, { month: "short" }).toUpperCase();
  const day = String(d.getDate()).padStart(2, "0");
  return { month, day };
}

type DayName =
  | "Sunday"
  | "Monday"
  | "Tuesday"
  | "Wednesday"
  | "Thursday"
  | "Friday"
  | "Saturday"

const DAYS: Record<DayName, number> = {
  Sunday: 0,
  Monday: 1,
  Tuesday: 2,
  Wednesday: 3,
  Thursday: 4,
  Friday: 5,
  Saturday: 6,
};

export const IndividualFacilityEventCalendar = (
    { facilityId, facilityName, filter }:
    { facilityId: string; facilityName: string; filter:string }) => {
        const { token } = useAuth(); 
        const [events, setEvents] = useState<TeamEvent[]>([]);   
        const [allTeams, setAllTeams] = useState<Team[]>([]);
        const [isModalOpen, setIsModalOpen] = useState(false);
        const [selectedEvent, setSelectedEvent] = useState<TeamEvent | null>(null);
        const [selectedEventTeam, setSelectedEventTeam] = useState<string | null>(null);
        const [calendarEvents, setCalendarEvents] = useState<FacilityCalendarItem[]>([]);
        const [refresh, setRefresh] = useState<number>(0)
        const [api, setApi] = useState<CalendarApi | null>(null);
    
            
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

        useEffect(() => {
            const updateCalendarEvents = async () => {
                const tempCalendarEvents:FacilityCalendarItem[] = events.map((e) => ({
                    id : e.id!,
                    title: getTeamName(e.teamId, allTeams),
                    daysOfWeek: [DAYS[e.dayOfWeek as DayName]],
                    startTime: e.startTime,
                    endTime:e.endTime,
                    extendedProps:{
                        originalEvent: e
                    },
                }))
                setCalendarEvents(tempCalendarEvents)
            };
            updateCalendarEvents();
        }, [events, allTeams]);

        function EventTrigger(info:EventClickArg) {
            const event = info.event.extendedProps.originalEvent
            setSelectedEvent(event);
            setSelectedEventTeam(getTeamName(event.teamId, allTeams));
            setIsModalOpen(true);
        }

    return (
        <div>
            <div>
                <ButtonGroup>
                <Button variant="outline" size="sm" onClick={() => api?.prev()}>
                    <ArrowLeft className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={() => api?.today()}>
                    Today
                </Button>
                <Button variant="outline" size="sm" onClick={() => api?.next()}>
                    <ArrowRight className="h-4 w-4" />
                </Button>
                </ButtonGroup>
            </div>

            <FullCalendar
            plugins={[timeGridPlugin, dayGridPlugin, interactionPlugin]}
            initialView="timeGridWeek"
            headerToolbar={false}
            allDaySlot={false}
            events={calendarEvents}
            eventClick ={EventTrigger}
            slotMinTime="04:00:00"
            slotMaxTime="23:00:00"
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