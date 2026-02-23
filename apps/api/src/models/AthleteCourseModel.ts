import { pool } from "../config/db";
import type { UserEvent } from "../types/index";

export interface NewAthleteCourseTime {
  athlete_id?: string;
  class_id: string;
  created_at?: string;
  updated_at?: string;
}

export const AthleteCourseModel = {
  async insert(data: NewAthleteCourseTime): Promise<UserEvent> {

    const res = await pool.query(
      `INSERT INTO user_events (
          user_id, class_id, created_at, updated_at
       ) VALUES ($1, $2, NOW(), NOW())
       RETURNING id, user_id, class_id, created_at, updated_at`,
      [data.athlete_id, data.class_id]
    );
    return res.rows[0] || null;
  },

  async updateAthleteCourseTime(
    classId: string,
    athleteId: string
  ): Promise<boolean> {
    const res = await pool.query(
      `UPDATE user_events
       SET class_id = $1, user_id = $2, updated_at = NOW()
       WHERE class_id = $1 AND user_id = $2`,
      [classId, athleteId]
    );
    return (res.rowCount ?? 0) > 0;
  },

  async deleteAthleteCourseTime(classId: string, athleteId: string): Promise<boolean> {
    const res = await pool.query(
      `DELETE FROM user_events
       WHERE class_id = $1 AND user_id = $2`,
      [classId, athleteId]
    );
    return (res.rowCount ?? 0) > 0;
  },

  async getAthletesForClass(classId: string): Promise<string[]> {
    const { rows } = await pool.query(
      `SELECT user_id FROM user_events WHERE class_id = $1`,
      [classId]
    );
    return rows.map((r: UserEvent) => r.user_id);
  },
};
