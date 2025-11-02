import { Router } from 'express';
import { success, z } from 'zod';
import { db } from '../db/schedule';
import { pool } from '../db';

const router = Router();
//psql -U user mydatabaseparsed
const courseTimeSchema = z.object({
    name: z.string().min(1).max(100),
    course_code: z.string().min(1).max(100).optional(),
    location: z.string().min(1).max(100),
    day_of_week: z.string().min(1).max(20),
    start_time: z
    .string()
    .regex(/^(0?[1-9]|1[0-2]):[0-5][0-9]\s?(AM|PM)$/i, "Invalid time format (use like '9:00 AM')").optional(),
  end_time: z
    .string()
    .regex(/^(0?[1-9]|1[0-2]):[0-5][0-9]\s?(AM|PM)$/i, "Invalid time format (use like '1:00 PM')").optional(),
    term: z.string().min(1).max(50),
    start_date:z.string().min(1).max(100),
    end_date:z.string().min(1).max(100),
    created_at: z.string().datetime().optional(),
    updated_at: z.string().datetime().optional(),
});

export const athleteCourseTimeSchema = z.object({
  athlete_id: z.string(),
  class_id: z.string(),
  created_at: z.string().datetime().optional(),
  updated_at: z.string().datetime().optional(),
});

router.post('/coursetime', async (req, res) => {
    try{
        const parse = courseTimeSchema.safeParse(req.body);

        if (!parse.success) return res.status(400).json({ error: 'Validation error', details: parse.error.flatten() });

        const { name, course_code, location, day_of_week, start_time, end_time, term, start_date, end_date, created_at, updated_at } = parse.data;


        const course_time = await db.courseInsert({  name, course_code, location, day_of_week, start_time, end_time, term, start_date, end_date, created_at, updated_at  });

        console.log("Added Course to DB")
        return res.status(200).json({
            message: "Added Course to DB",
            course_time:{
                id: course_time.id,
                name: course_time.name,
                course_code: course_time.course_code,
                location: course_time.location,
                day_of_week: course_time.day_of_week,
                start_time: course_time.start_time,
                end_time: course_time.end_time,
                term: course_time.term,
                start_date: course_time.start_date,
                end_date: course_time.end_date,
            },
            success:true,
        });
    }
    catch (error) {
        console.error("Error adding course", error);
        return res.status(500).json({ message: "Internal server error" });
    }
});

router.post('/athletecoursetime', async (req, res) => {
    try{
        const parse = athleteCourseTimeSchema.safeParse(req.body);

        if (!parse.success) return res.status(400).json({ error: 'Validation error', details: parse.error.flatten() });

        const { athlete_id, class_id, created_at, updated_at } = parse.data;
        const athlete_course_time = await db.athleteCourseInsert({ athlete_id, class_id, created_at, updated_at  });

        console.log("Added AthleteCourse to DB")
        return res.status(200).json({
            message: "Connected Course to Athlete",
            success: true
        });
    }
    catch (error) {
        console.error("Error adding course to athlete schedule:", error);
        return res.status(500).json({ message: "Internal server error" , success:false});
    }
});

router.post("/addcourseandathlete", async (req, res) => {
  const { user_id, coursetimedata } = req.body;

  const parseCourse = courseTimeSchema.safeParse(coursetimedata);
  if (!parseCourse.success) {
    return res.status(400).json({ error: "Validation error", details: parseCourse.error.flatten() });
  }

  try {
    const { course, athleteCourse } = await db.addCourseAndAthlete(
      parseCourse.data,
      { athlete_id: user_id, class_id: "" }
    );

    res.status(200).json({
      success: true,
      message: "Added course and linked athlete",
      course,
      athleteCourse,
    });
  } catch (err) {
    console.error("Error adding course and athlete:", err);
    res.status(500).json({ success: false, message: "Transaction failed" });
  }
});



router.get("/", (_req, res) => {
  res.json({ message: "Schedule route is running!" });
});

router.get("/athlete/:athleteId", async (req, res) => {
    try {
        
        const athleteId = req.params.athleteId;
        if (!athleteId) return res.status(400).json({ error: "Missing athlete ID" });

        const schedule = await db.getAthleteSchedule(athleteId);
        if (!schedule || schedule.length === 0) return res.status(404).json({ message: "No schedule found for this athlete." });
        
        return res.status(200).json(schedule);

    } catch (error) {

        console.error("Error fetching athlete schedule:", error);

        return res.status(500).json({ message: "Internal server error" });
    }
});

export default router;