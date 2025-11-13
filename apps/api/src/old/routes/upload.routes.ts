import { Router } from 'express';
import multer from 'multer';
import ical from 'node-ical';
import { format } from "date-fns";
import { toZonedTime } from "date-fns-tz"; //Because the dates are formated in UTC it gets wonky during daylight savings so we have to convert

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });
const timeZone = "America/Halifax"; // Atlantic Standard Time 

router.post("/", upload.array("files"), (req, res) => {
  const files = req.files as Express.Multer.File[];

  if (!files || files.length === 0) {
    return res.status(400).json({ message: "No files uploaded" });
  }

  const parsedSchedule: any[] = [];
  var filetype = '';
  const schedule = files[0];

  (schedule.mimetype ==="text/calendar" || schedule.originalname.endsWith(".ics") ?
  filetype = "iCal File uploaded successfully!"
  : filetype = "Other File uploaded successfully!")

  if(schedule.originalname.endsWith(".ics")){
    try{
      var count = 0;
      const icsData = schedule.buffer.toString("utf-8");
      const parsedFile = ical.parseICS(icsData);
      for (const key in parsedFile){
        const course = parsedFile[key];
        var existingCourse;
        if(course.type == "VEVENT"){
          //Check if parsed schedule is empty
          if(!parsedSchedule || parsedSchedule.length === 0){
            count = 1;
          }
          //Check if already added to parsedSchedule
          else{
            var courseName = course.summary;
            var courseStartTime = format(toZonedTime(course.start, timeZone), "h:mm a");
            var courseDotw = format(course.start,"EEEE");
            existingCourse = parsedSchedule.find(
              (item) =>
                item.name === courseName &&
                item.start_time === courseStartTime &&
                item.day_of_week === courseDotw
            );
            if(existingCourse){
              count++;
            }
            else{
              count = 1;
            }
          }
          //Create a new schedule object if it is the first occurance of the class
          if(count === 1){
            parsedSchedule.push({
              name: course.summary,
              course_code: course.summary,
              day_of_week: format(course.start,"EEEE"),
              start_time:format(toZonedTime(course.start, timeZone), "h:mm a"),
              end_time:format(toZonedTime(course.end, timeZone),"h:mm a"),
              location:course.location,
              term:"FALL 2025",//start => seot <=jan1 fall   jan1> april20< winter
              start_date:format(course.start, "yyyy-MM-dd"),
              end_date:format(course.start, "yyyy-MM-dd"),
            })
          }
          else{
            //update to new end date everytime the same class reoccurs
            existingCourse.end_date = format(course.start, "yyyy-MM-dd");
          }
        }
      }
      res.json({ message: filetype, course_times: parsedSchedule, schedule: true });
    }
    catch{
      res.status(400).json({ message: "Error Parsing File." , schedule: false});
    }
  }
  else{
     res.json({ message: filetype, schedule: false });
  }

});

router.get("/", (_req, res) => {
  res.json({ message: "Upload route is running!" });
});

export default router;