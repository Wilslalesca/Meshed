import { pool } from "./index";
import { CourseTime, AthleteCourseTime } from "../types.js";
import { nanoid } from "nanoid";

export interface NewCourseTime {
  name?: string;
  course_code?: string;
  location?: string;
  day_of_week?: string;
  start_time?: string;
  end_time?: string;
  term?:string;
  start_date?: string;
  created_at?: string;
  updated_at?: string;
}

export interface NewAthleteCourseTime {
  athlete_id?: string;
  class_id: string;
  created_at?: string;
  updated_at?: string;
}

/*CREATE TABLE course_times (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100),
  course_code VARCHAR(20),
  instructor_name VARCHAR(100),
  location VARCHAR(100),
  day_of_week VARCHAR(20),
  start_time TIME,
  end_time TIME,
  term VARCHAR(50)
);

CREATE TABLE athlete_course_times (
  id SERIAL PRIMARY KEY,
  athlete_id UUID REFERENCES athlete_profiles(id) ON DELETE CASCADE,
  class_id INT REFERENCES course_times(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);*/


export const db = {

  async insert(data: NewCourseTime): Promise<CourseTime> {
    const res = await pool.query(
      `INSERT INTO course_times (
          name, course_code, location, day_of_week, start_time,
          end_time, term, start_date, created_at, updated_at
       ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW(), NOW())
       RETURNING id, name, course_code,
                 location, day_of_week, start_time, end_time,
                 term, start_date, created_at, updated_at`,
      [
        data.name,
        data.course_code,
        data.location,
        data.day_of_week,
        data.start_time,
        data.end_time,
        data.term,
        data.start_date,
      ]
    );
    return res.rows[0];
  },

  
};