import { useAuth } from '@/shared/hooks/useAuth';
import { useState, useMemo } from 'react';

import { startOfWeekISO, endOfWeekISO } from '@/features/teams/Services/isoRange';

import { useAthleteSchedule } from '@/features/athlete-schedule/hooks/useAthleteSchedule';
import { mapScheduleToCourseRows } from '@/features/athlete-schedule/utils/mapScheduleToCourseRows';

//import { mapCourseRowsToScheduleEvents } from '@/features/teams/utils/mapSchedule';
import { mapCourseRowsToScheduleEvents} from "../Services/getTeamScheduleRange";
import { TeamScheduleCalendar } from '@/features/teams/components/schedule/TeamScheduleCalendar';

import { TeamScheduleView, TeamScheduleMode } from '@/features/teams/types/schedule';

export default function AthleteScheduleCalendarPage() {
  const { user, loading: authLoading } = useAuth();
  const athleteId = user?.id;

  const { schedule, loading } = useAthleteSchedule(athleteId);

  const [range, setRange] = useState({
    fromISO: startOfWeekISO(),
    toISO: endOfWeekISO(),
  });

  const [view, setView] = useState<TeamScheduleView>('timeGridWeek');
  const [mode, setMode] = useState<TeamScheduleMode>(TeamScheduleMode.Calendar);
  const [search, setSearch] = useState('');

  const events = useMemo(() => {
    if (!schedule || !athleteId || !user) return [];

    const courseRows = mapScheduleToCourseRows(schedule);

    return mapCourseRowsToScheduleEvents(
      { id: athleteId, name: user.name || "Me" },
      courseRows,
      range.fromISO,
      range.toISO
    );
  }, [schedule, range, athleteId, user]);

  if (authLoading || loading) return <div>Loading...</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">My Calendar</h1>

      <TeamScheduleCalendar
        view={view}
        setView={setView}
        events={events}
        mode={mode}                 
        setMode={setMode}           
        search={search}
        setSearch={setSearch}
        fromISO={range.fromISO}
        toISO={range.toISO}
        onRangeChange={(fromISO, toISO) =>
          setRange({ fromISO, toISO })
        }
      />
    </div>
  );
}