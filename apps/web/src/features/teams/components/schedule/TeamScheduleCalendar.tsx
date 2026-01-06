import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { useMemo, useRef, useEffect, use } from 'react';

import type { TeamScheduleEvent, TeamScheduleView } from '../../types/schedule';

export function TeamScheduleCalendar({view, events} : { view: TeamScheduleView; events: TeamScheduleEvent[] }) {
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

    // i needed this work around. When clicking month day week it wont update the calendar
    // this allowes us to trigger it when the view changes
    useEffect(() => {
        const api = calendarReference.current?.getApi();
        if (!api) return;

        if (api.view.type !== view) {
            api.changeView(view);
        }
        console.log(view)
    }, [view]);


    return (
        <div className='rounded-xl border bg-background p-3'>
            <FullCalendar
                ref={calendarReference}
                plugins={[ timeGridPlugin, dayGridPlugin, interactionPlugin ]}
                initialView={view}
                headerToolbar={false}
                height="auto"
                nowIndicator
                allDaySlot={false}
                slotMinTime="06:00:00"
                slotMaxTime="23:00:00"
                events={calendarEvents ?? []}
            />
        </div>
    );
}