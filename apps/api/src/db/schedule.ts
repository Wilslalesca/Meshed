import { pool } from "./index";
import { CourseTime, AthleteCourseTime } from "../types.js";

export interface NewCourseTime {
  name?: string;
  course_code?: string;
  location?: string;
  day_of_week?: string;
  start_time?: string;
  end_time?: string;
  term?:string;
  start_date?: string;
  end_date?: string;
  created_at?: string;
  updated_at?: string;
}

export interface NewAthleteCourseTime {
  athlete_id?: string;
  class_id: string;
  created_at?: string;
  updated_at?: string;
}

export const db = {

  async courseInsert(data: NewCourseTime): Promise<CourseTime> {
    const res = await pool.query(
      `INSERT INTO course_times (
          name, course_code, location, day_of_week, start_time,
          end_time, term, start_date, end_date, created_at, updated_at
       ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW(), NOW())
       RETURNING id, name, course_code,
                 location, day_of_week, start_time, end_time,
                 term, start_date, end_date, created_at, updated_at`,
      [
        data.name,
        data.course_code,
        data.location,
        data.day_of_week,
        data.start_time,
        data.end_time,
        data.term,
        data.start_date,
        data.end_date,
      ]
    );
    return res.rows[0];
  },

   async athleteCourseInsert(data: NewAthleteCourseTime): Promise<AthleteCourseTime> {
      const res = await pool.query(
        `INSERT INTO athlete_course_times (
            athlete_id, class_id, created_at, updated_at
         ) VALUES ($1, $2, NOW(), NOW())
         RETURNING id, athlete_id, class_id, created_at, updated_at`,
        [
          data.athlete_id,
          data.class_id,
        ]
      );
      return res.rows[0];
    },

  
};