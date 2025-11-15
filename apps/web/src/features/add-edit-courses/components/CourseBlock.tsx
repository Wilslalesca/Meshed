import React from "react";
import { useNavigate } from "react-router-dom";
import type { Schedule } from "@/features/athlete-schedule/types/Schedule";
import { formatTime } from "@/features/athlete-schedule/utils/formatTime";
import { Card, CardHeader, CardContent } from "@/shared/components//ui/card";
import { apiDeleteCourseById } from "@/features/add-edit-courses/api/deletecourse";
import { useAuth } from "@/shared/hooks/useAuth";
import { Button } from "@/shared/components//ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface Props {
    data: Schedule[];
}

export const CourseBlock: React.FC<Props> = ({ data }) => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const dayOrder: Record<string, number> = {
        Sunday: 0,
        Monday: 1,
        Tuesday: 2,
        Wednesday: 3,
        Thursday: 4,
        Friday: 5,
        Saturday: 6,
    };
    // Group the schedule entries by course name since repeating courses
    const grouped: Record<string, Schedule[]> = {};

    for (const course of data) {
        const key = course.name; // or course.course_id
        if (!grouped[key]) grouped[key] = [];
        grouped[key].push(course);
    }

    const handleDelete = async (classId: string) => {
        if (!window.confirm("Are you sure you want to delete this course?"))
            return;

        const success = await apiDeleteCourseById(classId, user?.id);

        if (success) {
            window.location.reload();
        } else {
            toast.error("Failed to delete course. Please try again.");
        }
    };

    return (
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-6">
        {Object.entries(grouped).map(([courseName, schedules]) => (
            <Card
            key={courseName}
            className="break-inside-avoid shadow-lg rounded-lg mb-6"
            >
            <CardHeader>
                <h1 className="text-xl font-bold">{courseName}</h1>
            </CardHeader>
            <CardContent className="p-4">
                {schedules
                .sort((a, b) => dayOrder[a.day_of_week] - dayOrder[b.day_of_week])
                .map((c, index) => (
                <div key={index} className="mb-2 last:mb-0">
                    <p className="text-muted-foreground text-sm">{c.day_of_week}</p>
                    <p className="text-muted-foreground text-sm">
                        {c.end_date != c.start_date
                        ? `${c.start_date} to ${c.end_date}`
                        : `${c.start_date}`
                        }
                    </p>
                    <p className="text-muted-foreground text-sm">
                    {formatTime(c.start_time)} – {formatTime(c.end_time)}
                    </p>
                    <p className="text-muted-foreground text-sm">{c.location}</p>
                    <p className="text-muted-foreground text-sm">{c.term}</p>
                    <div className="flex gap-2">
                    <Button
                        size="icon"
                        variant="outline"
                        onClick={() => navigate(`/editcourse/${c.id}`)}
                    >
                        <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                        size="icon"
                        variant="destructive"
                        onClick={() => handleDelete(c.id)}
                    >
                        <Trash2 className="w-4 h-4" />
                    </Button>
                </div>
                </div>
                ))}
            </CardContent>
            </Card>
        ))}
        </div>
    );
};

export default CourseBlock;
