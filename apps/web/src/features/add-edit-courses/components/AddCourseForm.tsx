import React from "react";
import { Button } from "@/components/ui/button"
import { useAuth } from '@/hooks/useAuth';
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useNavigate } from 'react-router-dom';
import { apiAddCourseAndAthleteCourse } from "@/features/add-edit-courses/api/addcourse"
import { formatTimeTo12Hour } from '../utils/formatTime'
import {
DropdownMenu,
DropdownMenuContent,
DropdownMenuLabel,
DropdownMenuRadioGroup,
DropdownMenuRadioItem,
DropdownMenuSeparator,
DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

export function AddCourseForm({
className,
...props
}: React.ComponentProps<"form">) {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [eventName, setEventName] = React.useState("");
    const [location, setLocation] = React.useState("");
    const [startTime, setStartTime] = React.useState("10:30:00");
    const [endTime, setEndTime] = React.useState("11:20:00");
    const [startDate, setStartDate] = React.useState("");
    const [endDate, setEndDate] = React.useState("");
    const [reoccurring, setReoccurring] = React.useState("");
    const weekdays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

    const handleSubmit = async () => {
        if (!eventName || !location || !startTime || !endTime || !startDate) {
            toast.error("Please fill in all required fields before submitting!");
            return;
        }
        if ( (startTime > endTime) || (endDate && startDate > endDate)) {
            toast.error("Ensure start date/time are before end date/time");
            return;
        }

        const d = new Date(startDate);
        const formSchedule = {
            name: eventName,
            course_code: eventName,
            day_of_week: weekdays[d.getDay()],
            start_time: formatTimeTo12Hour(startTime),
            end_time: formatTimeTo12Hour(endTime),
            location: location,
            term:( 
            d.getMonth() >= 8 && d.getMonth() <=11
            ? 'FALL'
            :  d.getMonth() >= 0 && d.getMonth() <= 3
            ? 'WINTER'
            : 'SUMMER'
            ),
            start_date: startDate,
            end_date: ( !endDate ? startDate : endDate),
        }

        try {
            const data = await apiAddCourseAndAthleteCourse(formSchedule, user?.id);
            console.log("API response:", data);
            if (data?.success) {
                toast.success(`Course ${data.course.name} added successfully!`);
            } else {
                toast.error(`Error: ${data?.message}`);
            }
        } catch (err) {
            console.error("Error submitting course:", err);
            toast.error("An unexpected error occurred");
        }
        setTimeout(() => navigate("/myschedule"), 200);
    }

    return (
    <form className="bg-white min-h-screen flex">
        <div className="w-full">
            <div>
                <h1 className="text-2xl font-bold">Add an Event</h1>
                <p className="text-muted-foreground text-sm text-balance">
                Add an event to your schedule, like a course or a doctor's appointment.
                </p>
            </div>
            <div className="flex-col items-center">
                <div className="grid w-full items-center gap-3 py-2">
                    <Label htmlFor="event">Event/Course Name</Label>
                    <Input
                        type="text"
                        id="event"
                        placeholder="e.g. Appointment or MATH1003"
                        value={eventName}
                        onChange={(e) => setEventName(e.target.value)}
                        required
                    />
                </div>

                <div className="grid w-full items-center gap-3 py-2">
                    <Label htmlFor="location">Location</Label>
                    <Input
                        type="text"
                        id="location"
                        placeholder="e.g. Currie Centre"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        required
                    />
                </div>

                <div className="grid w-full items-center gap-3 py-2">
                    <Label htmlFor="start_time">Start Time</Label>
                    <Input
                        type="time"
                        id="start_time"
                        value={startTime}
                        onChange={(e) => setStartTime(e.target.value)}
                        required
                    />
                </div>

                <div className="grid w-full items-center gap-3 py-2">
                    <Label htmlFor="end_time">End Time</Label>
                    <Input
                        type="time"
                        id="end_time"
                        value={endTime}
                        onChange={(e) => setEndTime(e.target.value)}
                        required
                    />
                </div>

                <div className="grid w-full items-center gap-3 py-2">
                <Label htmlFor="reoccurring">Is the event reoccurring?</Label>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                    <Button variant="outline">
                        {reoccurring}
                    </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent className="w-40">
                    <DropdownMenuLabel>Will the event reoccurr?</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuRadioGroup value={reoccurring} onValueChange={setReoccurring}>
                        <DropdownMenuRadioItem value="Yes">Yes</DropdownMenuRadioItem>
                        <DropdownMenuRadioItem value="No">No</DropdownMenuRadioItem>
                    </DropdownMenuRadioGroup>
                    </DropdownMenuContent>
                </DropdownMenu>
                </div>

                <div className="grid w-full items-center gap-3 py-2">
                    <Label htmlFor="start_date">{reoccurring === "Yes" ? "Start Date" : "Date"}</Label>
                    <Input
                        type="date"
                        id="start_date"
                        min="2025-01-01"
                        max="2035-12-31"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        required
                    />
                </div>

                {reoccurring === "Yes" && (
                    <div className="grid w-full items-center gap-3 py-2">
                        <Label htmlFor="end_date">End Date</Label>
                        <Input
                            type="date"
                            id="end_date"
                            min="2025-01-01"
                            max="2035-12-31"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                        />
                    </div>
                )}
                <div className="grid w-full items-center gap-3 py-2">
                    <Button type="button" onClick={handleSubmit}>
                    Submit
                    </Button>
                </div>
            </div>
        </div>
    </form>
        
    );
};