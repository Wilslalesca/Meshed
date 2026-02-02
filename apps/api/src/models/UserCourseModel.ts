/**
 * UserCourseModel — Generalized model for linking users to course_times.
 *
 * This replaces the athlete-specific AthleteCourseModel for new code paths.
 * It writes directly to user_course_times (no view/trigger overhead) and
 * supports optional JSONB metadata for sector-specific fields.
 *
 * Prefer this model over AthleteCourseModel for all new development.
 */
import { pool } from "../config/db";
import { UserCourseTime } from "../types/index";

/**
 * Payload for creating or updating a user-course link.
 * @property user_id - The user to link (any user, not just athletes)
 * @property class_id - The course_times entry to link
 * @property meta - Optional JSONB for role context, overrides, notes, etc.
 */
export interface NewUserCourseTime {
  user_id: string;
  class_id: string;
  meta?: Record<string, any>;
}

export const UserCourseModel = {
  /**
   * Link a user to a course. Uses ON CONFLICT to upsert if the link exists.
   * This avoids duplicate links while allowing metadata updates on re-add.
   */
  async insert(data: NewUserCourseTime, client?: any): Promise<UserCourseTime> {
    const c = client || pool;
    const res = await c.query(
      `INSERT INTO user_course_times (user_id, class_id, meta, created_at, updated_at)
       VALUES ($1, $2, $3::jsonb, NOW(), NOW())
       -- Match UNIQUE(user_id, class_id); update meta + timestamp if re-inserted
       ON CONFLICT (user_id, class_id) DO UPDATE SET
         meta = COALESCE(EXCLUDED.meta, user_course_times.meta),
         updated_at = NOW()
       RETURNING id, user_id, class_id, meta, created_at, updated_at`,
      [data.user_id, data.class_id, data.meta ? JSON.stringify(data.meta) : "{}"]
    );
    return res.rows[0];
  },

  /**
   * Update an existing user-course link by its ID.
   * Supports partial updates (user_id, class_id, meta).
   */
  async update(
    linkId: string,
    data: Partial<NewUserCourseTime>
  ): Promise<UserCourseTime | null> {
    const fields: string[] = [];
    const values: any[] = [];
    let idx = 1;

    if (data.user_id !== undefined) {
      fields.push(`user_id = $${idx++}`);
      values.push(data.user_id);
    }
    if (data.class_id !== undefined) {
      fields.push(`class_id = $${idx++}`);
      values.push(data.class_id);
    }
    if (data.meta !== undefined) {
      // Cast to jsonb to avoid type mismatch
      fields.push(`meta = $${idx++}::jsonb`);
      values.push(JSON.stringify(data.meta));
    }

    if (fields.length === 0) return null;

    values.push(linkId);
    const res = await pool.query(
      `UPDATE user_course_times
       SET ${fields.join(", ")}, updated_at = NOW()
       WHERE id = $${idx}
       RETURNING id, user_id, class_id, meta, created_at, updated_at`,
      values
    );
    return res.rows[0] || null;
  },

  /**
   * Remove a user-course link by user_id + class_id.
   * Returns true if a row was deleted.
   */
  async delete(userId: string, classId: string): Promise<boolean> {
    const res = await pool.query(
      `DELETE FROM user_course_times
       WHERE user_id = $1 AND class_id = $2`,
      [userId, classId]
    );
    return (res.rowCount ?? 0) > 0;
  },

  /**
   * Remove a user-course link by its row ID.
   */
  async deleteById(linkId: string): Promise<boolean> {
    const res = await pool.query(
      `DELETE FROM user_course_times WHERE id = $1`,
      [linkId]
    );
    return (res.rowCount ?? 0) > 0;
  },

  /**
   * Get all users linked to a specific course (e.g., for notifications).
   */
  async getUsersForClass(classId: string): Promise<string[]> {
    const { rows } = await pool.query(
      `SELECT user_id FROM user_course_times WHERE class_id = $1`,
      [classId]
    );
    return rows.map((r: any) => r.user_id);
  },

  /**
   * Get all courses linked to a specific user (their schedule).
   * Joins course_times to return full course details.
   */
  async getCoursesForUser(userId: string): Promise<any[]> {
    const { rows } = await pool.query(
      `SELECT ct.*, uct.meta AS link_meta, uct.created_at AS linked_at
       FROM course_times ct
       JOIN user_course_times uct ON ct.id = uct.class_id
       WHERE uct.user_id = $1
       ORDER BY ct.start_time`,
      [userId]
    );
    return rows;
  },

  /**
   * Check if a user is already linked to a course.
   */
  async exists(userId: string, classId: string): Promise<boolean> {
    const { rows } = await pool.query(
      `SELECT 1 FROM user_course_times WHERE user_id = $1 AND class_id = $2 LIMIT 1`,
      [userId, classId]
    );
    return rows.length > 0;
  },
};
