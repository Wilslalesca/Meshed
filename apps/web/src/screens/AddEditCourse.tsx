import React from "react";
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useNavigate } from 'react-router-dom';
import {apiAddCourse, formatTimeTo12Hour} from "../api/addeditcourse"
//import {AddCourseForm} from "./features/add-edit-courses/components/addCourseForm"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";


export const AddEditCourse: React.FC = () => {
  const navigate = useNavigate();
  const [eventName, setEventName] = React.useState("");
  const [location, setLocation] = React.useState("");
  const [startTime, setStartTime] = React.useState("10:30:00");
  const [endTime, setEndTime] = React.useState("11:20:00");
  const [startDate, setStartDate] = React.useState("");
  const [endDate, setEndDate] = React.useState("");
  const [reoccurring, setReoccurring] = React.useState("");
  const weekdays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  const handleSubmit = async () => {
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
    apiAddCourse(formSchedule);
    navigate('/upload');
  }

  return (
      <div className="bg-white min-h-screen flex items-center justify-center">
      <Card className="w-full max-w-sm shadow-lg">
        <CardHeader>
          <CardTitle>Add an Event</CardTitle>
          <CardDescription>
            Add an event to your schedule, like a course or a doctor's appointment!
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-col gap-2 items-center">
          <div className="grid w-full max-w-sm items-center gap-3 py-2">
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

          <div className="grid w-full max-w-sm items-center gap-3 py-2">
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

          <div className="grid w-full max-w-sm items-center gap-3 py-2">
            <Label htmlFor="start_time">Start Time</Label>
            <Input
              type="time"
              id="start_time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
              required
            />
          </div>

          <div className="grid w-full max-w-sm items-center gap-3 py-2">
            <Label htmlFor="end_time">End Time</Label>
            <Input
              type="time"
              id="end_time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
              required
            />
          </div>

          <div className="grid w-full max-w-sm items-center gap-3 py-2">
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

          <div className="grid w-full max-w-sm items-center gap-3 py-2">
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
          <div className="grid w-full max-w-sm items-center gap-3 py-2">
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

          <Button type="submit" onClick={handleSubmit} className="w-full gap-3 py-2">
            Submit
          </Button>
        </CardContent>
      </Card>
    </div>
      
  );
};