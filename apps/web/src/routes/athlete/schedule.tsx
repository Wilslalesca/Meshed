import { useState } from "react";
import { useAthleteSchedule } from '@/features/athlete-schedule/hooks/useAthleteSchedule';
import { CourseBlock } from '@/features/add-edit-courses/components/CourseBlock'
import { EmptyState } from '@/features/athlete-schedule/components/EmptyState';
import { AddCourseModal } from "@/features/add-edit-courses/components/AddCourseModal";
import { useAuth } from '@/shared/hooks/useAuth';
import { Button } from '@/shared/components/ui/button';
import { Upload } from '@/features/upload/components/Upload';

export default function AthleteSchedulePage() {
    const { user, loading: authLoading } = useAuth();
    const athleteId = user?.id;
    const { schedule, loading, refetch } = useAthleteSchedule(athleteId);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    if (authLoading || loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className='p-6'>
            <div className="flex items-center justify-between flex-wrap mb-4 gap-2">
                <h1 className='text-2xl font-semibold'>My Schedule</h1>
                <div className="flex flex-wrap items-center gap-2">
                    <Button onClick={() => setIsAddModalOpen(true)}>Add Event</Button>
                    <AddCourseModal
                        open={isAddModalOpen}
                        onOpenChange={setIsAddModalOpen}
                        onAdded={() => refetch()}
                    />
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