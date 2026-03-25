import { useState } from "react";
import { Button } from "@/shared/components//ui/button";
import { useAuth } from "@/shared/hooks/useAuth";
import { Input } from "@/shared/components//ui/input";
import { Label } from "@/shared/components//ui/label";
import { apiAddCourseAndAthleteCourse } from "@/features/add-edit-courses/api/addcourse";
import { formatTimeTo12Hour } from "../utils/formatTime";
import { Tabs, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/shared/components/ui/dialog";
import { toast } from "sonner";

export const AddCourseModal = ({
    open,
    onOpenChange,
    onAdded,
}: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onAdded: () => void;
}) => {
    const { user } = useAuth();
    const [eventName, setEventName] = useState("");
    const [location, setLocation] = useState("");
    const [startTime, setStartTime] = useState("10:30:00");
    const [endTime, setEndTime] = useState("11:20:00");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [reoccurring, setReoccurring] = useState("No");
    const weekdays = [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
    ];
    const [selectedDays, setSelectedDays] = useState<string[]>([]);

    const handleSubmit = async () => {
        if (!eventName || !location || !startTime || !endTime || !startDate) {
            toast.error(
                "Please fill in all required fields before submitting!"
            );
            return;
        }
        if (startTime > endTime || (endDate && startDate > endDate)) {
            toast.error("Ensure start date/time are before end date/time");
            return;
        }

        if (reoccurring === "Yes" && selectedDays.length === 0) {
            toast.error("Select at least one day of the week");
            return;
        }

        const d = new Date(startDate);
        const schedulesToSubmit =
            reoccurring === "Yes"
                ? selectedDays.map((day) => ({
                    name: eventName,
                    course_code: eventName,
                    day_of_week: day,
                    start_time: formatTimeTo12Hour(startTime),
                    end_time: formatTimeTo12Hour(endTime),
                    location: location,
                    term:
                        d.getMonth() >= 8 && d.getMonth() <= 11
                            ? "FALL"
                            : d.getMonth() >= 0 && d.getMonth() <= 3
                            ? "WINTER"
                            : "SUMMER",
                    start_date: startDate,
                    end_date: !endDate ? startDate : endDate,
                    recurring: (reoccurring == "Yes" ? true : false),
                }))
                :[{
                    name: eventName,
                    course_code: eventName,
                    day_of_week: weekdays[d.getDay()],
                    start_time: formatTimeTo12Hour(startTime),
                    end_time: formatTimeTo12Hour(endTime),
                    location: location,
                    term:
                        d.getMonth() >= 8 && d.getMonth() <= 11
                            ? "FALL"
                            : d.getMonth() >= 0 && d.getMonth() <= 3
                            ? "WINTER"
                            : "SUMMER",
                    start_date: startDate,
                    end_date: !endDate ? startDate : endDate,
                    recurring: (reoccurring == "Yes" ? true : false),
                },];

        try {
            for (const schedule of schedulesToSubmit) {
                const data = await apiAddCourseAndAthleteCourse(
                    schedule,
                    user?.id
                );
                if (data?.success) {
                    toast.success(`Course ${data.course.name} (${data.course.day_of_week}) added successfully!`);
                } else {
                    toast.error(`Error: ${data?.message}`);
                }
            }
        } catch (err) {
            console.error("Error submitting course:", err);
            toast.error("An unexpected error occurred");
        }
        onAdded()
        onOpenChange(false)
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md max-h-150 overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Add an Event</DialogTitle>
                    <DialogDescription>
                        Add an event to your schedule, like a course or a
                        doctor's appointment.
                    </DialogDescription>
                </DialogHeader>
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
                        <Label htmlFor="reoccurring">
                            Is the event recurring?
                        </Label>
                        <Tabs
                            value={reoccurring}
                            onValueChange={setReoccurring}
                            className="w-full"
                            defaultValue="No"
                        >
                            <TabsList className="grid w-full grid-cols-2">
                                <TabsTrigger className="w-full" value="Yes">
                                    Yes
                                </TabsTrigger>
                                <TabsTrigger className="w-full" value="No">
                                    No
                                </TabsTrigger>
                            </TabsList>
                        </Tabs>
                    </div>

                    {reoccurring === "Yes" && (
                        <div className="grid w-full items-center gap-3 py-2">
                            <Label>Day(s) of the Week</Label>
                            <div className="columns-1 sm:columns-2 lg:columns-3 gap-6">
                                {weekdays.map((day) => (
                                <div className="flex items-center gap-3" key={day}>
                                    <input
                                    type="checkbox"
                                    value={day}
                                    name="recurringDay"
                                    onChange={(e) => {
                                        if (e.target.checked) {
                                        setSelectedDays((s) => [...s, day]);
                                        } else {
                                        setSelectedDays((s) => s.filter((d) => d !== day));
                                        }
                                    }}
                                    />
                                    <Label>{day}</Label>
                                </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="grid w-full items-center gap-3 py-2">
                        <Label htmlFor="start_date">
                            {reoccurring === "Yes" ? "Start Date" : "Date"}
                        </Label>
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
                </DialogContent>
        </Dialog>
    );
}
