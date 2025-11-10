import React from 'react';
import { useNavigate } from "react-router-dom";
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import type { Schedule } from '@/features/athlete-schedule/types/Schedule';
import { formatTime } from '@/features/athlete-schedule/utils/formatTime';
import { Card,CardHeader, CardContent } from "@/components/ui/card"
import { apiDeleteCourseById } from "@/features/add-edit-courses/api/deletecourse"
import { useAuth } from '@/hooks/useAuth';
import { Button } from "@/components/ui/button"
import { Pencil, Trash2 } from "lucide-react";
import { toast } from 'sonner';

export function UserProfile() {
    const { user } = useAuth();
    const navigate = useNavigate();

    const [firstname, setFirstName] = React.useState(user?.firstName);
    const [lastname, setLastName] = React.useState(user?.lastName);
    const [startTime, setStartTime] = React.useState("10:30:00");
    const [endTime, setEndTime] = React.useState("11:20:00");
    const [startDate, setStartDate] = React.useState("");
    const [endDate, setEndDate] = React.useState("");
    
    

    return (
        <div className="m-4 gap-4">
            <form>
                <div className="w-full">
                    <div>
                        <h1 className="text-2xl font-bold">User Profile</h1>
                    </div>
                    <div className="flex flex-row items-center">
                        <div className="w-md items-center gap-3 py-2">
                            <Label htmlFor="name">First Name</Label>
                            <Input
                                type="text"
                                id="firstname"
                                name="firstname"
                                value={firstname}
                                onChange={(e) => setFirstName(e.target.value)}
                            />
                        </div>
                        <div className="w-md items-center gap-3 py-2">
                            <Label htmlFor="name">Last Name</Label>
                            <Input
                                type="text"
                                id="lastname"
                                name="lastname"
                                value={lastname}
                                onChange={(e) => setFirstName(e.target.value)}
                            />
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default UserProfile;
