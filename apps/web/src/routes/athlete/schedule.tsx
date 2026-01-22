import { useAthleteSchedule } from '@/features/athlete-schedule/hooks/useAthleteSchedule';
import { CourseBlock } from '@/features/add-edit-courses/components/CourseBlock'
import { EmptyState } from '@/features/athlete-schedule/components/EmptyState';
import { useAuth } from '@/shared/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/shared/components/ui/button';
import { Upload } from '@/features/upload/components/Upload';

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

    return (
        <div className='p-6'>
            <div className="flex items-center justify-between flex-wrap mb-4 gap-2">
                <h1 className='text-2xl font-semibold'>My Schedule</h1>
                <div className="flex flex-wrap items-center gap-2">
                    <Button type="submit" onClick={addCourse} className="px-3 py-2 flex-1 sm:flex-none bg-cyan-500 hover:bg-cyan-800">Add/Edit your Schedule</Button>
                    <Upload></Upload>
                </div>
            </div>   
            {!schedule?.length 
            ? <EmptyState />
            : <CourseBlock data={schedule}/>
            }
        </div>
    );
}