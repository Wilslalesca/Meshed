import React from "react";
import { useParams } from "react-router-dom";
import { EditCourseForm } from "@/features/add-edit-courses/components/EditCourseForm";
import { useAthleteSchedule } from "@/features/athlete-schedule/hooks/useAthleteSchedule";
import { useAuth } from "@/hooks/useAuth";

export const EditCourse: React.FC = () => {
  const { courseId } = useParams();
  const { user } = useAuth();
  const athleteId = user?.id;
  const { schedule } = useAthleteSchedule(athleteId);

  const courseToEdit = schedule?.find((c) => c.id === courseId);

  if (!courseToEdit) return <div>Course not found</div>;

  return (
    <div className="bg-white min-h-screen flex flex-col p-4">
      <EditCourseForm course={courseToEdit} />
    </div>
  );
};