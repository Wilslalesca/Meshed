import React from "react";
import { AddCourseForm } from "@/features/add-edit-courses/components/AddCourseForm";
import CourseBlock from "@/features/add-edit-courses/components/CourseBlock";
import { useAthleteSchedule } from '@/features/athlete-schedule/hooks/useAthleteSchedule';
import { useAuth } from '@/shared/hooks/useAuth';

export const AddCourse: React.FC = () => {
  return (
    <div className="bg-white min-h-screen flex flex-col md:flex-row p-4 gap-4">
      <div className="w-full">
        <AddCourseForm />
      </div>
    </div>
      
  );
};