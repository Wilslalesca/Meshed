import React from "react";
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useNavigate } from 'react-router-dom';
import {apiAddCourse, formatTimeTo12Hour} from "../../api/addcourse"
import { AddCourseForm } from "@/features/add-edit-courses/components/AddCourseForm";



export const AddCourse: React.FC = () => {

  return (
    <div className="bg-white min-h-screen flex p-4">
      <AddCourseForm />
    </div>
      
  );
};