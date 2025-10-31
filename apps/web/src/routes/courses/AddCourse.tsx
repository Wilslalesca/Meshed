import React from "react";
import { AddCourseForm } from "@/features/add-edit-courses/components/AddCourseForm";
import CourseBlock from "@/features/add-edit-courses/components/CourseBlock";
import { useAthleteSchedule } from '@/features/athlete-schedule/hooks/useAthleteSchedule';
import { useAuth } from '@/hooks/useAuth';




export const AddCourse: React.FC = () => {
  const { user, loading: authLoading } = useAuth();
  const athleteId = user?.id;
  //const { schedule, loading } = useAthleteSchedule(athleteId);

  return (
    <div className="bg-white min-h-screen flex p-4">
      <AddCourseForm />

    </div>
      
  );
};