import { useAthleteSchedule } from '@/features/athlete-schedule/hooks/useAthleteSchedule';
import { ScheduleTable } from '@/features/athlete-schedule/components/ScheduleTable';
import { EmptyState } from '@/features/athlete-schedule/components/EmptyState';
import { Button } from "@/components/ui/button"
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

export default function AthleteSchedulePage() {
    const { user, loading: authLoading } = useAuth();
    const athleteId = user?.id;
    const { schedule, loading } = useAthleteSchedule(athleteId);
    const navigate = useNavigate();
     const addCourse = async () => {
        navigate('/addcourse');
    }

    if (authLoading || loading) {
        return <div>Loading...</div>;
    }
    

    if (!schedule?.length) return <EmptyState />;

    return (
        <div className='p-6'>
            <Button type="submit" onClick={addCourse} className="w-full gap-3 bg-cyan-500 hover:bg-cyan-800">Add/Edit your Schedule</Button>
            <h1 className='text-2xl font-semibold mb-4'>My Schedule</h1>
            <ScheduleTable data={schedule} />
        </div>
    );
}