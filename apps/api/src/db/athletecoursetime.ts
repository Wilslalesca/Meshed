import { pool } from "./index";
import { AthleteCourseTime } from "../types.js";

export interface NewAthleteCourseTime {
  athlete_id?: string;
  class_id: string;
  created_at?: string;
  updated_at?: string;
}

export const db = {

  async insert(data: NewAthleteCourseTime): Promise<AthleteCourseTime> {
    const res = await pool.query(
      `INSERT INTO athlete_course_times (
          athlete_id, class_id, created_at, updated_at
       ) VALUES ($1, $2, NOW(), NOW())
       RETURNING id, name, course_code,
                 athlete_id, class_id, created_at, updated_at`,
      [
        data.athlete_id,
        data.class_id,
      ]
    );
    return res.rows[0];
  },

  
};