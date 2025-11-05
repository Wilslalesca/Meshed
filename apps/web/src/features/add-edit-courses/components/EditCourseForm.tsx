import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { apiEditCourse } from "../api/editcourse";
import type { Schedule } from '@/features/athlete-schedule/types/Schedule';
import { useNavigate } from 'react-router-dom';
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { formatTimeTo12Hour } from "../utils/formatTime"

interface EditCourseModalProps {
  course: Schedule;
}

export const EditCourseForm: React.FC<EditCourseModalProps> = ({ course }) => {
    const [formData, setFormData] = useState(course);
    const { user } = useAuth();
    const navigate = useNavigate();
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };
    const weekdays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

    const handleSubmit = async () => {
        if ( (formData.start_time > formData.end_time) || (formData.end_date && formData.start_date > formData.end_date)) {
            alert("Ensure start date/time are before end date/time");
            return;
        }

        const d = new Date(formData.start_date);
        const formSchedule = {
            id: formData.id,
            name: formData.name,
            course_code: formData.name,
            day_of_week: weekdays[d.getDay()],
            start_time: formatTimeTo12Hour(formData.start_time),
            end_time: formatTimeTo12Hour(formData.end_time),
            location: formData.location,
            term:( 
            d.getMonth() >= 8 && d.getMonth() <=11
            ? 'FALL'
            :  d.getMonth() >= 0 && d.getMonth() <= 3
            ? 'WINTER'
            : 'SUMMER'
            ),
            start_date: formData.start_date,
            end_date: ( !formData.end_date ? formData.start_date : formData.end_date),
        }
        const success = await apiEditCourse(formData.id, user?.id, formSchedule);
        if (success) {
            alert("Successfully updated course");
            navigate('/addcourse');

        }
        else alert("Failed to update course");
    };

    const handleCancel = async () => {
        navigate('/addcourse')
    };

    return (
        <form>
            <div className="w-full">
                <div>
                    <h1 className="text-2xl font-bold">Edit Event</h1>
                </div>
                <div className="flex-col items-center">
                    <div className="grid w-full items-center gap-3 py-2">
                        <Label htmlFor="name">Name</Label>
                        <Input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="grid w-full items-center gap-3 py-2">
                        <Label htmlFor="location">Location</Label>
                        <Input
                            type="text"
                            id="location"
                            name="location"
                            value={formData.location}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="grid w-full items-center gap-3 py-2">
                        <Label htmlFor="start_time">Start Time</Label>
                        <Input
                            type="time"
                            id="start_time"
                            name="start_time"
                            value={formData.start_time}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="grid w-full items-center gap-3 py-2">
                        <Label htmlFor="end_time">End Time</Label>
                        <Input
                            type="time"
                            id="end_time"
                            name = "end_time"
                            value={formData.end_time}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="grid w-full items-center gap-3 py-2">
                        <Label htmlFor="start_date">Start Date</Label>
                        <Input
                            type="date"
                            id="start_date"
                            name="start_date"
                            value={formData.start_date}
                            onChange={handleChange}
                        />
                    </div>


                    <div className="grid w-full items-center gap-3 py-2">
                        <Label htmlFor="end_date">End Date</Label>
                        <Input
                            type="date"
                            id="end_date"
                            name="end_date"
                            value={formData.end_date}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="grid w-full items-center gap-3 py-2">
                        <Button type="button" onClick={handleSubmit}>
                            Submit
                        </Button>
                        <Button type="button" onClick={handleCancel}>
                            Cancel
                        </Button>
                    </div>
                </div>
            </div>
        </form>
    );
};
