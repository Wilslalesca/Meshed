import { Request, Response } from "express";
import ical from "node-ical";
import { format } from "date-fns";
import { toZonedTime } from "date-fns-tz";

const timeZone = "America/Halifax";

export const UploadController = {
  async uploadICS(req: Request, res: Response) {
    const files = req.files as Express.Multer.File[];

    if (!files || files.length === 0) {
      return res.status(400).json({ message: "No files uploaded" });
    }

    const parsedSchedule: any[] = [];
    const schedule = files[0];

    let filetype = "";
    if (schedule.mimetype === "text/calendar" || schedule.originalname.endsWith(".ics")) {
      filetype = "iCal File uploaded successfully!";
    } else {
      filetype = "Other File uploaded successfully!";
    }

    if (schedule.originalname.endsWith(".ics")) {
      try {
        let count = 0;
        const icsData = schedule.buffer.toString("utf-8");
        const parsedFile = ical.parseICS(icsData);

        for (const key in parsedFile) {
          const course = parsedFile[key];
          let existingCourse: any;

          if (course.type == "VEVENT") {
            if (!parsedSchedule || parsedSchedule.length === 0) {
              count = 1;
            } else {
              const courseName = course.summary;
              const courseStartTime = format(toZonedTime(course.start, timeZone), "h:mm a");
              const courseDotw = format(course.start, "EEEE");
              existingCourse = parsedSchedule.find(
                (item) =>
                  item.name === courseName &&
                  item.start_time === courseStartTime &&
                  item.day_of_week === courseDotw
              );
              if (existingCourse) {
                count++;
              } else {
                count = 1;
              }
            }

            if (count === 1) {
              const d = new Date(course.start);
              parsedSchedule.push({
                name: course.summary,
                course_code: course.summary,
                day_of_week: format(course.start, "EEEE"),
                start_time: format(toZonedTime(course.start, timeZone), "h:mm a"),
                end_time: format(toZonedTime(course.end, timeZone), "h:mm a"),
                location: course.location,
                term: d.getMonth() >= 8 && d.getMonth() <= 11
                    ? "FALL"
                    : d.getMonth() >= 0 && d.getMonth() <= 3
                    ? "WINTER"
                    : "SUMMER",
                start_date: format(course.start, "yyyy-MM-dd"),
                end_date: format(course.start, "yyyy-MM-dd"),
                recurring: false,
              });
            } else {
              existingCourse.end_date = format(course.start, "yyyy-MM-dd");
              existingCourse.recurring = true;
            }
          }
        }

        res.json({ message: filetype, course_times: parsedSchedule, schedule: true });
      } catch {
        res.status(400).json({ message: "Error Parsing File.", schedule: false });
      }
    } else {
      res.json({ message: filetype, schedule: false });
    }
  },

  async health(_req: Request, res: Response) {
    res.json({ message: "Upload route is running!" });
  },
};
