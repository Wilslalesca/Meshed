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

  async updateAthleteCourseTime(classId: string, athleteId: string, data: Partial<NewAthleteCourseTime>): Promise<void> {
    const fields = Object.keys(data);
    const values = Object.values(data);
    const setClause = fields.map((field, index) => `${field} = $${index + 1}`).join(", ");

    if (fields.length === 0) return;

    await pool.query(
      `UPDATE athlete_course_times
        SET ${setClause}, updated_at = NOW()
        WHERE class_id = $${fields.length + 1} AND athlete_id = $${fields.length + 2}`,
      [...values, classId, athleteId]
    );
  },

  async deleteAthleteCourseTime(classId: string, athleteId: string): Promise<boolean> {
    const res = await pool.query(
      `DELETE FROM athlete_course_times
       WHERE class_id = $1 AND athlete_id = $2
       RETURNING id`,
      [classId, athleteId]
    );

    return (res.rowCount ?? 0) > 0;
  },

  
};