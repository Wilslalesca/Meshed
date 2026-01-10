

// TODO pull all students in a team and show their schedules in a combined view
// TODO call out to calendar API to pull in events

// 1) Create basic calendar view
// 2) add options for month view / week view / day view
// 3) Filters 
// 4) Heatmap view for busy times across team members
// 5) Conglomerate View for seeing each persons name for time slots
// 6) Pull data via backend


import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { TeamScheduleCalendar } from "../schedule/TeamScheduleCalendar";
import { TeamScheduleToolbar } from "../schedule/TeamScheduleToolbar";
import { useTeamSchedule } from "../../hooks/useTeamSchedule";
import { useRoster } from "../../hooks/useRoster";

import { TeamScheduleView, TeamScheduleMode } from "../../types/schedule";



function startOfWeekISO(d = new Date()) {
    const date = new Date(d);
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1); 
    const weekStart = new Date(date.setDate(diff));
    weekStart.setHours(0, 0, 0, 0);
    return weekStart.toISOString();
}

function endOfWeekISO(d = new Date()) {
    const date = new Date(d);
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? 0 : 7); 
    const weekEnd = new Date(date.setDate(diff));
    weekEnd.setHours(23, 59, 59, 999);
    return weekEnd.toISOString();
}




export const TeamScheduleTab = () => {
  const { teamId } = useParams<{ teamId: string }>();
  const [view, setView] = useState<TeamScheduleView>(TeamScheduleView.Week);
  const [mode, setMode] = useState<TeamScheduleMode>(TeamScheduleMode.Calendar);
  const [search, setSearch] = useState<string>("");
  const fromISO = useMemo(() => startOfWeekISO(), []);
  const toISO = useMemo(() => endOfWeekISO(), []);
  const [range, setRange] = useState<{ fromISO: string; toISO: string }>({ fromISO, toISO });

  const { roster } = useRoster(teamId!);
  const rosterCount = roster?.length ?? 0;

  const { events, loading: eventsLoading, error } = useTeamSchedule(teamId!, range.fromISO, range.toISO);

  const filteredEvents = useMemo(() => {
      const query = search.trim().toLowerCase();

      if (!query) return events;

      return events.filter((e) => 
          e.title.toLowerCase().includes(query) ||
          e.athleteName.toLowerCase().includes(query)
      );
  }, [events, search]);

  return (
    <div className="space-y-4">
        <TeamScheduleToolbar
            view={view}
            setView={setView}
            search={search}
            setSearch={setSearch}
            mode={mode}
            setMode={setMode}
        />
        
        { error && (
          <div className="text-sm text-destructive">Something went wrong: {error}</div>
        )}
        <div className="relative">
          <TeamScheduleCalendar
              view={view}
              events={filteredEvents}
              mode={mode}
              fromISO={range.fromISO}
              toISO={range.toISO}
              rosterCount={rosterCount}
              onRangeChange={(fromISO, toISO) => setRange({ fromISO, toISO })}
          />

          {/* {eventsLoading && (
            <div className="absolute inset-0 flex items-start justify-end p-3 pointer-events-none">
              <div className="rounded-md bg-background/90 border px-3 py-1 text-xs text-muted-foreground">
                Loading…
              </div>
            </div>
          )} */}
        </div>
    </div>
  );
};
