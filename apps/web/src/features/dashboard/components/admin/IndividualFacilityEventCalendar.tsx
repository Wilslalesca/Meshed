import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { apiGetTeamById } from "@/features/teams/api/teams"
import { useEffect, useState, useRef, useMemo } from "react";
import { useAuth } from "@/shared/hooks/useAuth";
import type { TeamEvent } from "@/features/teams/types/event";
import { getFacilityEvents, getStatusFacilityEvents, getConflictingFacilityEvents } from "../../api/dashboardApi";
import type { Team } from "@/features/teams/types/teams";
import { getTeamName } from "@/features/dashboard/helpers/getTeamName"
import { StatusModal } from "./StatusModal";
import type {FacilityCalendarItem} from "@/features/dashboard/types/eventItem"
import type { EventClickArg } from '@fullcalendar/core';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { ButtonGroup } from "@/shared/components/ui/button-group";
import { Button } from '@/shared/components/ui/button';
import { TeamScheduleMode, TeamScheduleView } from '@/features/teams/types/schedule';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import type { CalendarApi } from '@fullcalendar/core';
import { startOfWeekISO, endOfWeekISO } from "@/features/teams/Services/isoRange";
import {combineLocalDateTime} from "@/features/teams/Services/getTeamScheduleRange.ts";

function getMonthDayChip(api: CalendarApi | null) {
  if (!api) return { month: "", day: "" };

  const d = api.getDate(); 
  const month = d.toLocaleString(undefined, { month: "short" }).toUpperCase();
  const day = String(d.getDate()).padStart(2, "0");
  return { month, day };
}

export const IndividualFacilityEventCalendar = (
    { facilityId, filter }:
    { facilityId: string; filter:string }) => {
        const { token } = useAuth(); 
        const [events, setEvents] = useState<TeamEvent[]>([]);   
        const [allTeams, setAllTeams] = useState<Team[]>([]);
        const [isModalOpen, setIsModalOpen] = useState(false);
        const [selectedEvent, setSelectedEvent] = useState<TeamEvent | null>(null);
        const [selectedEventTeam, setSelectedEventTeam] = useState<string | null>(null);
        const [calendarEvents, setCalendarEvents] = useState<FacilityCalendarItem[]>([]);
        const [refresh, setRefresh] = useState<number>(0)
        const [api, setApi] = useState<CalendarApi | null>(null);
        const [title, setTitle] = useState<string>("");
        const chip = useMemo(() => getMonthDayChip(api), [api]);
        const calendarReference = useRef<FullCalendar | null>(null);
        const [view, setView] = useState<TeamScheduleView>(TeamScheduleView.Week);
    
        useEffect(() => {
            const calApi = calendarReference.current?.getApi();
            if(!calApi) return;

            setApi(calApi);
            setTitle(calApi.view.title);

        }, []);

        useEffect(() => {
            if (!api) return;
            if (api.view.type !== view) api.changeView(view);
            setTitle(api.view.title);

        }, [api, view]);

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
                    start: combineLocalDateTime(e.startDate, e.startTime),
                    end: combineLocalDateTime(e.startDate, e.endTime),
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
        <div className="team-calendar rounded-2xl border border-border/60 bg-background/70 shadow-sm">
            <div className='rounded-2xl p-3 '>
                <div className='mb-3 flex items-center justify-between gap-3'>
                    <div className="flex items-center gap-3 min-w-0">
                        <div className="flex items-center gap-3 min-w-0">
                            <div className="flex overflow-hidden rounded-lg border bg-background shadow-sm">
                            <div className="px-2 py-1 text-[10px] font-semibold tracking-wider text-muted-foreground bg-muted/40">
                                {chip.month}
                            </div>
                            <div className="px-2 py-1 text-sm font-semibold tabular-nums">
                                {chip.day}
                            </div>
                            </div>

                            <div className="min-w-0">
                            <div className="truncate text-sm font-semibold">{title}</div>
                            <div className="truncate text-xs text-muted-foreground">
                                {api?.view?.activeStart
                                ? `${api.view.activeStart.toLocaleDateString()} – ${api.view.activeEnd.toLocaleDateString()}`
                                : ""}
                            </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
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

                            <Select
                                value={api?.view.type ?? view}
                                onValueChange={(val) => {
                                    const nextView = val as TeamScheduleView;
                                    setView(nextView);
                                    api?.changeView(val);
                                }}
                                >
                                <SelectTrigger className="w-[140px]">
                                    <SelectValue placeholder="Select view" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="timeGridWeek">Week view</SelectItem>
                                    <SelectItem value="dayGridMonth">Month view</SelectItem>
                                    <SelectItem value="timeGridDay">Day view</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>
            </div>

            <FullCalendar
            ref={calendarReference}
            plugins={[timeGridPlugin, dayGridPlugin, interactionPlugin]}
            initialView={view}
            headerToolbar={false}
            allDaySlot={false}
            events={calendarEvents}
            eventClick ={EventTrigger}
            slotMinTime="04:00:00"
            slotMaxTime="23:00:00"
            height="auto"
            datesSet={(arg) => {
                setTitle(arg.view.title);
            }}
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