import { useMemo } from 'react';
import type { TeamScheduleEvent } from '../../types/schedule';

type prop = {
    events: TeamScheduleEvent[];
    fromISO: string;
    toISO: string;
    slotMinutes?: number;
    dayStartHour?: number;
    dayEndHour?: number;
};

function startOfDay(d: Date) {
    const date = new Date(d);
    date.setHours(0, 0, 0, 0);
    return date;
}

function addDays(d: Date, days: number) {
    const date = new Date(d);
    date.setDate(date.getDate() + days);
    return date;
}




export function TeamScheduleHeatmap({ events, fromISO, toISO, slotMinutes = 30, dayStartHour = 6, dayEndHour = 23 }: prop) {
    const { days, slots, counts, maxCount } = useMemo(() => {
        const start = startOfDay(new Date(fromISO));
        const toDate = new Date(toISO);
        const end = startOfDay(new Date(toDate.getTime() - 1));


        const days: Date[] = [];
        for (let i = new Date(start); i <= end; i = addDays(i, 1)) {
            days.push(new Date(i));
        }

        const startMinutes = dayStartHour * 60;
        const endMinutes = dayEndHour * 60;
        const slots: number[] = [];

        for (let i = startMinutes; i < endMinutes; i += slotMinutes) {
            slots.push(i);
        }

        const counts = Array.from({ length: days.length }, () =>
            Array.from({ length: slots.length }, () => 0)
        );

        const IsValid = (dt: Date) => !Number.isNaN(dt.getTime());

        for (const event of events) {
            const eventStart = new Date(event.startTime);
            const eventEnd = new Date(event.endTime);

            if (!IsValid(eventStart) || !IsValid(eventEnd) || eventEnd <= eventStart) continue;

            const clampedStart = eventStart < start ? start : eventStart;
            const clampedEnd = eventEnd > toDate ? toDate : eventEnd;
     

            if (clampedEnd <= clampedStart) continue;

            for (let i = 0; i < days.length; i++) {
                const day = days[i];

                const dayStart = new Date(day);
                dayStart.setHours(0, 0, 0, 0);

                const dayEnd = addDays(dayStart, 1);

                if (clampedEnd <= dayStart || clampedStart >= dayEnd) continue;

                const overlapStart = clampedStart > dayStart ? clampedStart : dayStart;
                const overlapEnd = clampedEnd < dayEnd ? clampedEnd : dayEnd;

                const sMin = overlapStart.getHours() * 60 + overlapStart.getMinutes();
                const eMin = overlapEnd.getHours() * 60 + overlapEnd.getMinutes();

                for ( let j = 0; j < slots.length; j++) {
                    const slotStartMin = slots[j];
                    const slotEndMin = slotStartMin + slotMinutes;

                    const overlaps = sMin < slotEndMin && eMin > slotStartMin;
                    if (overlaps) {
                        counts[i][j]++;
                    }
                }
            }
        }

        let maxCount = 0;
        for ( const day of counts ) {
            for ( const count of day) {
                maxCount = Math.max(maxCount, count);
            }
        }
        return { days, slots, counts, maxCount };
    }, [events, fromISO, toISO, slotMinutes, dayStartHour, dayEndHour]);

    return (
        <div className='rounded-xl border bg-background p-3'>
            <div className='text-sm font-medium mb-3'>
                Team Busy Heatmap
            </div>

            <div className='text-xs text-muted-foreground'>
                {days.map((day, dayIdx) => (
                    <div key={dayIdx} className='text-xs text-muted-foreground text-center'>
                        {day.toLocaleDateString(undefined, { weekday: "short" })}
                    </div>
                ))}

                { slots.map((slot, slotIdx) => {
                    const hours = String(Math.floor(slot / 60)).padStart(2, "0");
                    const minutes = String(slot % 60).padStart(2, "0");
                    const timeLabel = `${hours}:${minutes}`;

                    return (
                        <div key={slotIdx} className="contents">
                            <div className='text-[11px] text-muted-foreground pr-2 flex items-center justify-end'>
                                {timeLabel}
                            </div>

                            { days.map((_, dayIdx) => {
                                const count = counts[dayIdx][slotIdx];
                                const opacity = maxCount === 0 ? 0 : Math.min(1, 0.15 + (count / maxCount) * 0.85);

                                return (
                                    <div
                                        key={`${dayIdx}-${slotIdx}`}
                                            className="h-5 rounded-sm border bg-muted relative"
                                            title={count === 1 ? "1 user busy" : `${count} users busy`}
                                            style={{ opacity: count === 0 ? 0.25 : opacity }}
                                        >
                                            {count > 0 && (
                                                <div className="absolute inset-0 flex items-center justify-center text-[10px] font-medium text-white">
                                                    {count}
                                                </div>
                                            )}
                                    </div>
                                );
                            })}
                        </div>
                    );
                    })
                }
            </div>
            <div className='mt-3 text-xs text-muted-foreground'>
                Counts show how many users are busy per {slotMinutes}-minute slot.
            </div>
        </div>
    );
}