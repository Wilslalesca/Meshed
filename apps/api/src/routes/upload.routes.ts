import { Router } from 'express';
import multer from 'multer';
import ical from 'node-ical';
import { format } from "date-fns";

const router = Router();
const upload = multer({ dest: "uploads/" }); // stores files locally

router.post("/", upload.array("files"), (req, res) => {
  const files = req.files as Express.Multer.File[];
  if (!files || files.length === 0) {
    return res.status(400).json({ message: "No files uploaded" });
  }

  const parsedSchedule: any[] = [];

  console.log("Files uploaded:", req.files);
  var filetype = '';
  const schedule = files[0];
  (schedule.mimetype ==="text/calendar" || schedule.originalname.endsWith(".ics") ?
  filetype = "iCal File uploaded successfully!"
  : filetype = "Other File uploaded successfully!")

  try{
    const parsedFile= ical.sync.parseFile(schedule.path);
    for (const key in parsedFile){
      const course = parsedFile[key];
      if(course.type == "VEVENT"){
        parsedSchedule.push({
          summary: course.summary,
          dayOfTheWeek: format(course.start,"EEEE"),
          startTime:format(course.start, "h:mm a"),
          endTime:format(course.end,"h:mm a"),
          start:course.start,
          end:course.end,
          location:course.location,
        })
      }
    }
    //const events2 = ical.parseICS(schedule.path);
    console.log(parsedSchedule);
    res.json({ message: filetype, files: req.files });
  }
  catch{
    res.status(400).json({ message: "Error Parsing File." });
  }

});

router.get("/", (_req, res) => {
  res.json({ message: "Upload route is running!" });
});

export default router;