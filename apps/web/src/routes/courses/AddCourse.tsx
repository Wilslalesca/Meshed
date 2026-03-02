import React from "react";
import { AddCourseForm } from "@/features/add-edit-courses/components/AddCourseForm";

export const AddCourse: React.FC = () => {
  return (
    <div className="bg-white min-h-screen flex flex-col md:flex-row p-4 gap-4">
      <div className="w-full">
        <AddCourseForm />
      </div>
    </div>
      
  );
};