import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { useMemo, useRef, useEffect } from 'react';
import { buildHeatmapOverlayEvents } from './heatmapOverlay';

import { TeamScheduleMode, type TeamScheduleEvent, type TeamScheduleView } from '../../types/schedule';
export function TeamScheduleCalendar({
  view,
  events,
  mode,
  rosterCount,
  fromISO,
  toISO,
}: {
  view: TeamScheduleView;
  events: TeamScheduleEvent[];
  mode: TeamScheduleMode;
  rosterCount?: number;
  fromISO: string;
  toISO: string;
  }) {
  const calendarReference = useRef<FullCalendar | null>(null);

  const calendarEvents = useMemo(() => {
    return events.map((e) => ({
      id: e.id,
      title: `${e.athleteName}: ${e.title}`,
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
    if (api.view.type !== view) api.changeView(view);
  }, [view]);

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
          }
        }}
      />
    </div>
  );
}
