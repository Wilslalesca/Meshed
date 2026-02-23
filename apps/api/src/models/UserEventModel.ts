import { pool } from "../config/db";
import type { UserEvent } from "../types/index";

export interface NewUserEvent {
  user_id?: string;
  class_id: string;
  created_at?: string;
  updated_at?: string;
}

export const UserEventModel = {
  async insert(data: NewUserEvent): Promise<UserEvent> {

    const res = await pool.query(
      `INSERT INTO user_events (
          user_id, class_id, created_at, updated_at
       ) VALUES ($1, $2, NOW(), NOW())
       RETURNING id, user_id, class_id, created_at, updated_at`,
      [data.user_id, data.class_id]
    );
    return res.rows[0] || null;
  },

  async updateUserEvent(
    classId: string,
    userId: string,
    data: Partial<NewUserEvent>
  ): Promise<boolean> {
    const fields = Object.keys(data);
    const values = Object.values(data);
    const setClause = fields.map((field, index) => `${field} = $${index + 1}`).join(", ");

    // If no explicit fields are provided, treat this as a "touch" to bump updated_at.
    if (fields.length === 0) {
      const res = await pool.query(
        `UPDATE user_events
         SET updated_at = NOW()
         WHERE class_id = $1 AND user_id = $2`,
        [classId, userId]
      );
      return (res.rowCount ?? 0) > 0;
    }

    const res = await pool.query(
      `UPDATE user_events
       SET ${setClause}, updated_at = NOW()
       WHERE class_id = $${fields.length + 1} AND user_id = $${fields.length + 2}`,
      [...values, classId, userId]
    );
    return (res.rowCount ?? 0) > 0;
  },

  async deleteUserEvent(classId: string, userId: string): Promise<boolean> {
    const res = await pool.query(
      `DELETE FROM user_events
       WHERE class_id = $1 AND user_id = $2`,
      [classId, userId]
    );
    return (res.rowCount ?? 0) > 0;
  },

  async getUsersForClass(classId: string): Promise<string[]> {
    const { rows } = await pool.query(
      `SELECT user_id FROM user_events WHERE class_id = $1`,
      [classId]
    );
    return rows.map((r: UserEvent) => r.user_id);
  },
};
