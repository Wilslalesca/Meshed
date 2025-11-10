import React from 'react';
import { useNavigate } from "react-router-dom";
import type { Schedule } from '@/features/athlete-schedule/types/Schedule';
import { formatTime } from '@/features/athlete-schedule/utils/formatTime';
import { Card,CardHeader, CardContent } from "@/components/ui/card"
import { apiDeleteCourseById } from "@/features/add-edit-courses/api/deletecourse"
import { useAuth } from '@/hooks/useAuth';
import { Button } from "@/components/ui/button"
import { Pencil, Trash2 } from "lucide-react";
import { toast } from 'sonner';

export function ManagerProfile() {
    const { user } = useAuth();
    const navigate = useNavigate();
    

    return (
        <div className="flex flex-col gap-4">
            <h1>Manager Profile</h1>
            <pre>{JSON.stringify(user, null, 2)}</pre>
        </div>
    );
};

export default ManagerProfile;
