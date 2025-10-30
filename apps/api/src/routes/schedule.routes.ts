import { Router } from 'express';
import { success, z } from 'zod';
import { db } from '../db/schedule';

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
    const parse = courseTimeSchema.safeParse(req.body);

    if (!parse.success) return res.status(400).json({ error: 'Validation error', details: parse.error.flatten() });

    const { name, course_code, location, day_of_week, start_time, end_time, term, start_date, end_date, created_at, updated_at } = parse.data;


    const course_time = await db.courseInsert({  name, course_code, location, day_of_week, start_time, end_time, term, start_date, end_date, created_at, updated_at  });


    return res.status(201).json({
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
});

router.post('/athletecoursetime', async (req, res) => {
    const parse = athleteCourseTimeSchema.safeParse(req.body);

    if (!parse.success) return res.status(400).json({ error: 'Validation error', details: parse.error.flatten() });

    const { athlete_id, class_id, created_at, updated_at } = parse.data;


    const athlete_course_time = await db.athleteCourseInsert({ athlete_id, class_id, created_at, updated_at  });


    return res.status(201).json({
        message: "Connected Course to Athlete",
        course_time:{
            id: athlete_course_time.id,
            athlete_id: athlete_course_time.athlete_id,
            class_id: athlete_course_time.class_id,
        }
    });
});

router.get("/", (_req, res) => {
  res.json({ message: "Schedule route is running!" });
});

export default router;