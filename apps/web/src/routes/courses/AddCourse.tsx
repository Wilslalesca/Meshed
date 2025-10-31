import React from "react";
import { AddCourseForm } from "@/features/add-edit-courses/components/AddCourseForm";
import CourseBlock from "@/features/add-edit-courses/components/CourseBlock";
import { useAthleteSchedule } from '@/features/athlete-schedule/hooks/useAthleteSchedule';
import { useAuth } from '@/hooks/useAuth';




export const AddCourse: React.FC = () => {
  const { user, loading: authLoading } = useAuth();
  const athleteId = user?.id;
  const { schedule, loading } = useAthleteSchedule(athleteId);

  return (
    <div className="bg-white min-h-screen flex flex-col md:flex-row p-4 gap-4">
      <div className="w-full md:w-1/2 md:pr-4">
        <AddCourseForm />
      </div>

      <div className="w-full md:w-1/2 items-center justify-center overflow-y-auto max-h-[80vh]">
        {!schedule?.length
        ? <div></div>
        : <CourseBlock data={schedule}/>
        }
      </div>
    </div>
      
  );
};