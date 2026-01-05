import { pool } from "../config/db";
import { AthleteCourseTime } from "../types/index";

export interface NewAthleteCourseTime {
  athlete_id?: string;
  class_id: string;
  created_at?: string;
  updated_at?: string;
}

export const AthleteCourseModel = {
  async insert(data: NewAthleteCourseTime, client?: any): Promise<AthleteCourseTime> {
    const c = client || pool;

    const res = await c.query(
      `INSERT INTO athlete_course_times (
          athlete_id, class_id, created_at, updated_at
       ) VALUES ($1, $2, NOW(), NOW())
       RETURNING id, athlete_id, class_id, created_at, updated_at`,
      [data.athlete_id, data.class_id]
    );
    return res.rows[0] || null;
  },

  async updateAthleteCourseTime(
    classId: string,
    athleteId: string,
    data: Partial<NewAthleteCourseTime>
  ): Promise<boolean> {
    const fields = Object.keys(data);
    const values = Object.values(data);
    const setClause = fields.map((field, index) => `${field} = $${index + 1}`).join(", ");

    if (fields.length === 0) return false;

    const res = await pool.query(
      `UPDATE athlete_course_times
       SET ${setClause}, updated_at = NOW()
       WHERE class_id = $${fields.length + 1} AND athlete_id = $${fields.length + 2}`,
      [...values, classId, athleteId]
    );
    return (res.rowCount ?? 0) > 0;
  },

  async deleteAthleteCourseTime(classId: string, athleteId: string): Promise<boolean> {
    const res = await pool.query(
      `DELETE FROM athlete_course_times
       WHERE class_id = $1 AND athlete_id = $2`,
      [classId, athleteId]
    );
    return (res.rowCount ?? 0) > 0;
  },

  async getAthletesForClass(classId: string): Promise<string[]> {
    const { rows } = await pool.query(
      `SELECT athlete_id FROM athlete_course_times WHERE class_id = $1`,
      [classId]
    );
    return rows.map((r: any) => r.athlete_id);
  },
};
