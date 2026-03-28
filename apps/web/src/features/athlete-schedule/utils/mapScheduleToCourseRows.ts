import type { CourseTimeRow } from '@/features/teams/types/schedule';
import type { Schedule } from '../types/Schedule';

export function mapScheduleToCourseRows(schedule: Schedule[]): CourseTimeRow[] {
  return schedule.map((s) => ({
    id: s.id,
    name: s.name ?? null,
    course_code: s.course_code ?? null,
    location: s.location ?? null,
    day_of_week: s.day_of_week,
    start_time: s.start_time,
    end_time: s.end_time,
    start_date: s.start_date ?? null,
    end_date: s.end_date ?? null,
    recurring: true,
    term: s.term ?? null,
  }));
}