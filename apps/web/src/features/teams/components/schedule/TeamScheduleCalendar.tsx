import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { useMemo, useRef, useEffect } from 'react';
import { buildHeatmapOverlayEvents } from './heatmapOverlay';

import { TeamScheduleMode, type TeamScheduleEvent, type TeamScheduleView } from '../../types/schedule';
import type { CalendarApi } from '@fullcalendar/core';

export function TeamScheduleCalendar({
  view,
  events,
  mode,
  rosterCount,
  fromISO,
  toISO,
  onRangeChange,
  onApiReady,
}: {
  view: TeamScheduleView;
  events: TeamScheduleEvent[];
  mode: TeamScheduleMode;
  rosterCount?: number;
  fromISO: string;
  toISO: string;
  onRangeChange?: (fromISO: string, toISO: string) => void;
  onApiReady?: (api: CalendarApi) => void;
  }) {
  const calendarReference = useRef<FullCalendar | null>(null);

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
    const api = calendarReference.current?.getApi();
    if (!api) return;
    onApiReady?.(api);
    if (api.view.type !== view) api.changeView(view);
  }, [onApiReady, view]);

  return (
    <div className="rounded-xl border bg-background p-3">
      <FullCalendar
        key={`${view}-${mode}`}
        ref={calendarReference}
        plugins={[timeGridPlugin, dayGridPlugin, interactionPlugin]}
        initialView={view}
        headerToolbar={false}
        height="auto"
        nowIndicator
        allDaySlot={false}
        slotMinTime="06:00:00"
        slotMaxTime="23:00:00"
        events={allEvents}
        eventDidMount={(info) => {
          if (info.event.display === "background") {
            info.el.style.borderRadius = "6px";
            return;
          }

          const ext = info.event.extendedProps as any;
          const type = ext?.type;

          if (type === "team_event") {
            info.el.style.backgroundColor = "rgb(14 116 144)"; 
            info.el.style.borderColor = "white";
          } else if (type === "class") {
            info.el.style.backgroundColor = "rgb(29 78 216)"; 
            info.el.style.borderColor = "rgb(29 78 216)";
          }
        }}

        datesSet={(arg) => {
          onRangeChange?.(arg.start.toISOString(), arg.end.toISOString());
        }}
      />
    </div>
  );
}
