import { Router } from 'express';
import multer from 'multer';
import ical from 'node-ical';
import { format } from "date-fns";
import { toZonedTime } from "date-fns-tz"; //Because the dates are formated in UTC it gets wonky during daylight savings so we have to convert

const router = Router();
const upload = multer({ dest: "uploads/" }); // stores files locally
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
      const parsedFile= ical.sync.parseFile(schedule.path);
      for (const key in parsedFile){
        const course = parsedFile[key];
        if(course.type == "VEVENT"){
          //Check if parsed schedule is empty
          if(!parsedSchedule || parsedSchedule.length === 0){
            count = 1;
          }
          //Check if already added to parsedSchedule
          else{
            var prevSummary = parsedSchedule[parsedSchedule.length-1].summary;
            var prevStartTime = parsedSchedule[parsedSchedule.length-1].startTime;
            if(prevSummary === course.summary && prevStartTime === format(toZonedTime(course.start, timeZone), "h:mm a")){
              count++;
            }
            else{
              count = 1;
            }
          }
          //Create a new schedule object if it is the first occurance of the class
          if(count === 1){
            parsedSchedule.push({
              summary: course.summary,
              dayOfTheWeek: format(course.start,"EEEE"),
              startTime:format(toZonedTime(course.start, timeZone), "h:mm a"),
              endTime:format(toZonedTime(course.end, timeZone),"h:mm a"),
              start:toZonedTime(course.start, timeZone),
              end:toZonedTime(course.end, timeZone),
              location:course.location,
            })
          }
        }
      }
      //for testing purposes only, remove later
      console.log("Complete Schedule: ");
      console.log(parsedSchedule);
      res.json({ message: filetype, files: req.files });
    }
    catch{
      res.status(400).json({ message: "Error Parsing File." });
    }
  }
  else{
     res.json({ message: filetype});
  }

});

router.get("/", (_req, res) => {
  res.json({ message: "Upload route is running!" });
});

export default router;