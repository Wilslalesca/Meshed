
import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { TeamScheduleCalendar } from "../schedule/TeamScheduleCalendar";
import { useRoster } from "../../hooks/useRoster";
import type { TeamScheduleEvent } from "../../types/schedule";
import { TeamScheduleView, TeamScheduleMode } from "../../types/schedule";



type Props = {
  events: TeamScheduleEvent[];
  range: { fromISO: string; toISO: string };
  error?:string | null;
  onRangeChange: (range: { fromISO: string; toISO: string }) => void;
  onReload: () => void;
};

export const TeamScheduleTab = ({
  events,
  range,
  error,
  onRangeChange,
}: Props) => {
  const { teamId } = useParams<{ teamId: string }>();
  const [view, setView] = useState<TeamScheduleView>(TeamScheduleView.Week);
  const [mode, setMode] = useState<TeamScheduleMode>(TeamScheduleMode.Calendar);
  const [search, setSearch] = useState<string>("");

  const { roster } = useRoster(teamId!);
  const rosterCount = roster?.length ?? 0;


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
        
        { error && (
          <div className="text-sm text-destructive">Something went wrong: {error}</div>
        )}
        <div className="relative">
          <TeamScheduleCalendar
              view={view}
              setView={setView}
              events={filteredEvents}
              mode={mode}
              setMode={setMode}
              search={search}
              setSearch={setSearch}
              fromISO={range.fromISO}
              toISO={range.toISO}
              rosterCount={rosterCount}
              onRangeChange={(fromISO, toISO) => onRangeChange({ fromISO, toISO })}
          />
        </div>
    </div>
  );
};
