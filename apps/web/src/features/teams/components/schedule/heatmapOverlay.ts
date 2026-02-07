import type { TeamScheduleEvent } from "../../types/schedule";

type BackgroundEvent = {
    id: string;
    start: string;
    end: string;
    display: "background";
    backgroundColor: string;
};

const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(max, n));

function startOfDay(d: Date) {
    const x = new Date(d);
    x.setHours(0, 0, 0, 0);
    return x;
}
function addDays(d: Date, days: number) {
    const x = new Date(d);
    x.setDate(x.getDate() + days);
    return x;
}
function setMinutesFromMidnight(day: Date, minutes: number) {
    const d = new Date(day);
    d.setHours(0, 0, 0, 0);
    d.setMinutes(minutes);
    return d;
}


export function buildHeatmapOverlayEvents({
    events, fromISO, toISO, rosterCount, slotMinutes = 30, dayStartHour = 6, dayEndHour = 23
}: {
    events: TeamScheduleEvent[];
    fromISO: string;
    toISO: string;
    rosterCount: number;
    slotMinutes?: number;
    dayStartHour?: number;
    dayEndHour?: number;
}): BackgroundEvent[] {
    const fromDate = startOfDay(new Date(fromISO));
    const toDate = startOfDay(new Date(toISO));

    const startMin = dayStartHour * 60;
    const endMin = dayEndHour * 60;

    const days: Date[] = [];
    for (let i = new Date(fromDate); i <= toDate; i = addDays(i, 1)) {
        days.push(new Date(i));
    }

    const slots: number[] = [];
    for (let min = startMin; min < endMin; min += slotMinutes) {
        slots.push(min);
    }

    const counts = Array.from({ length: days.length }, () =>
        Array.from({ length: slots.length }, () => 0)
    ); 
    
    for (const e of events) {

        const eventStart = new Date(e.startTime);
        const eventEnd = new Date(e.endTime);

        if (eventEnd <= eventStart) continue;

        for (let di = 0; di < days.length; di++) {
            const day = days[di];
            const dayStart = new Date(day);
            dayStart.setHours(0, 0, 0, 0);
            const dayEnd = new Date(day);
            dayEnd.setHours(23, 59, 59, 999);

            if (eventEnd <= dayStart || eventStart >= dayEnd) continue;

            const overlapStart = eventStart > dayStart ? eventStart : dayStart;
            const overlapEnd = eventEnd < dayEnd ? eventEnd : dayEnd;

            const sMin = overlapStart.getHours() * 60 + overlapStart.getMinutes();
            const eMin = overlapEnd.getHours() * 60 + overlapEnd.getMinutes();

            for (let si = 0; si < slots.length; si++) {
                const slotStart = slots[si];
                const slotEnd = slotStart + slotMinutes;
                const overlaps = sMin < slotEnd && eMin > slotStart;

                if (overlaps) counts[di][si] += 1;
            }
        }
    }


    const bgEvents: BackgroundEvent[] = [];

    for (let di = 0; di < days.length; di++) {
        let runStartSlotIdx: number | null = null;
        let runCount = 0;

        const flushRun = (endSlotIdxExclusive: number) => {
            if (runStartSlotIdx === null || runCount <= 0) return;

            const startMinutes = slots[runStartSlotIdx];
            const endMinutes = slots[endSlotIdxExclusive - 1] + slotMinutes;

            const startDt = setMinutesFromMidnight(days[di], startMinutes);
            const endDt = setMinutesFromMidnight(days[di], endMinutes);

            const denom = rosterCount > 0 ? rosterCount : 1;
            const ratio = clamp(runCount / denom, 0, 1);

            const gamma = 0.8;
            const intensity = Math.pow(ratio, gamma);

            const alpha = clamp(0.25 + intensity * 0.83, 0.12, 0.95);

            const color = `rgba(220, 38, 38, ${alpha})`;

            bgEvents.push({
                id: `hm:${di}:${startMinutes}-${endMinutes}:${runCount}`,
                start: startDt.toISOString(),
                end: endDt.toISOString(),
                display: "background",
                backgroundColor: color,
            });

            runStartSlotIdx = null;
            runCount = 0;
        };
    

        for (let si = 0; si < slots.length; si++) {
            const c = counts[di][si];

            // start a run
            if (c > 0 && runStartSlotIdx === null) {
                runStartSlotIdx = si;
                runCount = c;
                continue;
            }

            if (c > 0 && runStartSlotIdx !== null && c === runCount) {
                continue;
            }

            if (runStartSlotIdx !== null) {
                flushRun(si);
            }

            if (c > 0) {
                runStartSlotIdx = si;
                runCount = c;
            }
        }

        if (runStartSlotIdx !== null) {
            flushRun(slots.length);
        }
    }

    return bgEvents;
}