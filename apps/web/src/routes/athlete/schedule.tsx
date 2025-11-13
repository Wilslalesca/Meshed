import { useAthleteSchedule } from '@/features/athlete-schedule/hooks/useAthleteSchedule';
import { ScheduleTable } from '@/features/athlete-schedule/components/ScheduleTable';
import { EmptyState } from '@/features/athlete-schedule/components/EmptyState';
import { useAuth } from '@/shared/hooks/useAuth';

export default function AthleteSchedulePage() {
    const { user, loading: authLoading } = useAuth();
    const athleteId = user?.id;
    const { schedule, loading } = useAthleteSchedule(athleteId);

    if (authLoading || loading) {
        return <div>Loading...</div>;
    }

    if (!schedule?.length) return <EmptyState />;

    return (
        <div className='p-6'>
            <h1 className='text-2xl font-semibold mb-4'>My Schedule</h1>
            <ScheduleTable data={schedule} />
        </div>
    );
}