// calendar packages 
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import type { CalendarApi } from '@fullcalendar/core';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import {
  ButtonGroup
} from "@/shared/components/ui/button-group";
import { Search, X, ArrowLeft, ArrowRight } from 'lucide-react';
import { useMemo, useRef, useEffect, useState } from 'react';
import { Button } from '@/shared/components/ui/button';
import { buildHeatmapOverlayEvents } from './heatmapOverlay';

import { TeamScheduleMode, TeamScheduleView, type TeamScheduleEvent } from '../../types/schedule';

function getMonthDayChip(api: CalendarApi | null) {
  if (!api) return { month: "", day: "" };

  const d = api.getDate(); 
  const month = d.toLocaleString(undefined, { month: "short" }).toUpperCase();
  const day = String(d.getDate()).padStart(2, "0");
  return { month, day };
}


export function TeamScheduleCalendar({
  view,
  events,
  mode,
  setMode,
  search,
  setSearch,
  rosterCount,
  fromISO,
  toISO,
  onRangeChange,
}: {
  view: TeamScheduleView;
  events: TeamScheduleEvent[];
  mode: TeamScheduleMode;
  setMode: (m: TeamScheduleMode) => void;
  search: string;
  setSearch: (s: string) => void;
  rosterCount?: number;
  fromISO: string;
  toISO: string;
  onRangeChange?: (fromISO: string, toISO: string) => void;
  }) {

  const calendarReference = useRef<FullCalendar | null>(null);
  const [api, setApi] = useState<CalendarApi | null>(null);
  const [title, setTitle] = useState<string>("");
  const chip = useMemo(() => getMonthDayChip(api), [api, title]);
  const [searchOpen, setSearchOpen] = useState(false);
  const searchRef = useRef<HTMLInputElement | null>(null);


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
    if (searchOpen) {
      requestAnimationFrame(() => searchRef.current?.focus());
    }
  }, [searchOpen]);



  useEffect(() => {
    if (!api) return;
    if (api.view.type !== view) api.changeView(view);
    setTitle(api.view.title);

  }, [api, view]);

  return (
  <div className="team-calendar rounded-2xl border border-border/60 bg-background/70 shadow-sm">
      <div className='rounded-2xl p-3 '>

        {/* Tool bar stuff only  */}
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
            </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center">
              <div
                className={[
                  "flex items-center overflow-hidden rounded-md border bg-background transition-all duration-200",
                  searchOpen ? "w-[220px] px-2" : "w-9 px-0",
                  "h-9",
                ].join(" ")}
              >
                <button
                  type="button"
                  className="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:text-foreground border-0 outline-none ring-0 focus:outline-none focus:ring-0"
                  onClick={() => setSearchOpen((v) => !v)}
                  aria-label="Search"
                >
                  <Search className="h-4 w-4" />
                </button>

                <input
                  ref={searchRef}
                  className={[
                    "h-8 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground ",
                    searchOpen ? "ml-1 opacity-100" : "ml-0 w-0 opacity-0 pointer-events-none",
                    "transition-all duration-200",
                  ].join(" ")}
                  placeholder="Search…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onBlur={() => {
                    if (!search.trim()) setSearchOpen(false);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Escape") {
                      setSearch("");
                      setSearchOpen(false);
                    }
                  }}
                />

                {searchOpen && search.trim().length > 0 && (
                  <button
                    type="button"
                    className="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:text-foreground border-0"
                    onClick={() => setSearch("")}
                    aria-label="Clear search"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>


            <ButtonGroup>
              <Button 
                      variant={mode === TeamScheduleMode.Calendar ? "default" : "outline"}
                      onClick={() => setMode(TeamScheduleMode.Calendar)}
                  >
                      Calendar
                  </Button>
                  <Button
                      disabled={view === TeamScheduleView.Month}
                      variant={mode === TeamScheduleMode.Heatmap ? "default" : "outline"}
                      onClick={() => setMode(TeamScheduleMode.Heatmap)}
                  >
                      Heatmap
                  </Button>
            </ButtonGroup>
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
              onValueChange={(val) => api?.changeView(val)}
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
        
        {/* the actual calendar */}
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
    </div>
  );
}
