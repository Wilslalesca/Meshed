import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import type { OptimizedCalendarResult } from "../../types/OptimizationResult"

export const OptimizedScheduleCalendar = ({
    optimizedEvents,
}: { optimizedEvents: OptimizedCalendarResult[]; }) => {

    const calendarEvents = optimizedEvents.map(event => ({
        id: event.id,
        title: event.title,
        daysOfWeek: [event.dayOfWeek],
        startTime: event.startTime,
        endTime: event.endTime
    }))

    return (
        <FullCalendar
        plugins={[timeGridPlugin, interactionPlugin]}
        initialView="timeGridWeek"
        headerToolbar={false}
        allDaySlot={false}
        events={calendarEvents}
        height="auto"
        />
  )
}