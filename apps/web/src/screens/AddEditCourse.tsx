import React from "react";
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {apiAddCourse2} from "../api/addeditcourse"
//import { Checkbox } from "@/components/ui/checkbox"
//import { type DateRange } from "react-day-picker"
//import { Calendar } from "@/components/ui/calendar"
//import { toast } from "sonner"


export const AddEditCourse: React.FC = () => {
  const [schedule, setSchedule] = React.useState({
    name: '',
    course_code: '',
    day_of_week: '',
    start_time:'',
    end_time:'',
    location:'',
    term:"",
    start_date:'',
    end_date:'',
    reoccurring: "",
  })
   /*const handleSubmit = async () => {
        toast("Event has been created", {
          description: "Sunday, December 03, 2023 at 9:00 AM",
          action: {
            label: "Undo",
            onClick: () => console.log("Undo"),
          },
        })
        return toast;
  }*/
 //const [dateRange, setDateRange] = React.useState<DateRange | undefined>({
 //   from: new Date(2025, 5, 12),
 //   to: new Date(2025, 6, 15),
 // })
 

  const [date, setDate] = React.useState<Date | undefined>(undefined)
  const [timeZone, setTimeZone] = React.useState<string | undefined>(undefined)
  React.useEffect(() => {
    setTimeZone(Intl.DateTimeFormat().resolvedOptions().timeZone)
  }, [])
  const handleSubmit = async () => {
    const parsedSchedule = {
      name: 'CS1012',
      course_code: 'CS1012',
      day_of_week: 'Wednesday',
      start_time:'10:00AM',
      end_time:'10:00PM',
      location:'Head Hall',
      term:"FALL 2025",
      start_date:'10-23-10',
      end_date:'10-23-10',
    }

    const formSchedule = {
      name: schedule.name,
      course_code: schedule.name,
      day_of_week: "Wednesday",
      start_time: schedule.start_time,
      end_time: schedule.end_time,
      location: schedule.location,
      term: "FALL 2025",
      start_date: schedule.start_date,
      end_date: schedule.end_date,
      reoccurring: schedule.reoccurring,
    }
    
    apiAddCourse2(formSchedule);
  }

  return (
      <div className= "bg-white min-h-screen flex items-center justify-center">
          <Card className= "w-full max-w-sm shadow-lg">
              <CardHeader>
                  <CardTitle>Add an Event</CardTitle>
                  <CardDescription>Add an event to your schedule, like a course or a doctors appointment!</CardDescription>
              </CardHeader>
              <CardContent className="flex-col gap-2 items-center">
                  <div className="grid w-full max-w-sm items-center gap-3 py-2">
                    <Label htmlFor="event">Event/Course Name</Label>
                    <Input type="string" id="event" placeholder="e.g. Appointment or MATH1003" />
                  </div>

                  <div className="grid w-full max-w-sm items-center gap-3 py-2">
                    <Label htmlFor="location">Location</Label>
                    <Input type="string" id="event" placeholder="e.g. Currie Centre" />
                  </div>

                  <div className="grid w-full max-w-sm items-center gap-3 py-2">
                    <Label htmlFor="start_time">Start Time</Label>
                    <Input type="string" id="start_time" placeholder="e.g. 10:00" />
                  </div>

                  <div className="grid w-full max-w-sm items-center gap-3 py-2">
                    <Label htmlFor="end_time">End Time</Label>
                    <Input type="string" id="end_time" placeholder="e.g. 12:00" />
                  </div>

                  <div className="grid w-full max-w-sm items-center gap-3 py-2">
                    <Label htmlFor="start_date">Date</Label>
                    <Input type="string" id="start_date" placeholder="2025-10-24" />
                  </div>

                  <div className="grid w-full max-w-sm items-center gap-3 py-2">
                    <Label htmlFor="reoccuring">Is the event reoccuring?</Label>
                    <Input type="string" id="reoccuring" placeholder="Yes/No" />
                  </div>
                  <Button type="submit" onClick = {handleSubmit} className="w-full">Submit</Button>
              </CardContent>
          </Card>
      </div>
      
  );
};