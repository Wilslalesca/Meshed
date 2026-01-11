// calendar packages 
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import type { CalendarApi } from '@fullcalendar/core';



import { useMemo, useRef, useEffect, useState } from 'react';
import { Button } from '@/shared/components/ui/button';
import { buildHeatmapOverlayEvents } from './heatmapOverlay';

import { TeamScheduleMode, type TeamScheduleEvent, type TeamScheduleView } from '../../types/schedule';



export function TeamScheduleCalendar({
  view,
  events,
  mode,
  rosterCount,
  fromISO,
  toISO,
  onRangeChange,
}: {
  view: TeamScheduleView;
  events: TeamScheduleEvent[];
  mode: TeamScheduleMode;
  rosterCount?: number;
  fromISO: string;
  toISO: string;
  onRangeChange?: (fromISO: string, toISO: string) => void;
  }) {

  const calendarReference = useRef<FullCalendar | null>(null);
  const [api, setApi] = useState<CalendarApi | null>(null);
  const [title, setTitle] = useState<string>("");


  const calendarEvents = useMemo(() => {
    return events.map((e) => ({
      id: e.id,
      title: e.athleteName,
      start: e.startTime,
      end: e.endTime,
      extendedProps: e,
    }));
  }, [events]);

  const heatmapBackgroundEvents = useMemo(() => {
    if (mode !== TeamScheduleMode.Heatmap) return [];

    return buildHeatmapOverlayEvents({
      events,
      fromISO,
      toISO,
      rosterCount: rosterCount || 0,
      slotMinutes: 30,
      dayStartHour: 6,
      dayEndHour: 23,
    });
  }, [events, fromISO, toISO, mode, rosterCount]);

  const allEvents = useMemo(() => {
    if (mode === TeamScheduleMode.Heatmap) {
        return heatmapBackgroundEvents;
    }
    return calendarEvents;
  }, [mode,heatmapBackgroundEvents, calendarEvents]);

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

  return (
    <div className="team-calendar rounded-xl border bg-background p-3">
      <div className='mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between'>
        <div className="flex item-center gap-2">
          <Button variant="outline" size="sm" onClick={() => api?.prev()}>Prev</Button>
          <Button variant="outline" size="sm" onClick={() => api?.today()}>Today</Button>
          <Button variant="outline" size="sm" onClick={() => api?.next()}>Next</Button>
        </div>
        <div className="text-sm font-semibold">{title}</div>

      </div>
      <FullCalendar
        ref={calendarReference}
        plugins={[timeGridPlugin, dayGridPlugin, interactionPlugin]}
        initialView={view}
        headerToolbar={false}
        dayHeaderFormat={{ weekday: "short", month: "numeric", day: "numeric" }}
        height="auto"
        nowIndicator
        allDaySlot={false}
        slotMinTime="06:00:00"
        slotMaxTime="23:00:00"
        events={allEvents}
        eventClassNames={(arg) => {
          const type = (arg.event.extendedProps as any)?.type;
          if (type  === "team_event") return ["ev", "ev-team"];
          if (type === "class") return ["ev", "ev-class"];
          return ["ev"];
        }}
         eventDidMount={(info) => {
          if (info.event.display === "background") {
            info.el.style.borderRadius = "10px";
          }
        }}

        datesSet={(arg) => {
          setTitle(arg.view.title);
          onRangeChange?.(arg.start.toISOString(), arg.end.toISOString());
        }}
      />
    </div>
  );
}
