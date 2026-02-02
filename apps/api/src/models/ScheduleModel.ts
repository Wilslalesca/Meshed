import { pool } from "../config/db";

/**
 * ScheduleModel — Retrieves schedule data for users.
 * 
 * Uses user_course_times as the source of truth for all user types
 * (athletes, patients, customers, staff, etc.)
 */
export const ScheduleModel = {
  /**
   * Get all courses linked to a user (their schedule).
   * Joins course_times for full details and includes link-level metadata.
   * 
   * @param userId - The user's ID (works for any user type)
   */
  async getUserSchedule(userId: string) {
    const res = await pool.query(
      `SELECT 
         ct.id, ct.name, ct.course_code, ct.location, ct.day_of_week,
         ct.start_time, ct.end_time, ct.term, ct.start_date, ct.end_date,
         ct.recurring, ct.meta AS course_meta,
         uct.meta AS link_meta, uct.created_at, uct.updated_at
       FROM course_times ct
       JOIN user_course_times uct ON ct.id = uct.class_id
       WHERE uct.user_id = $1
       ORDER BY ct.start_time`,
      [userId]
    );
    return res.rows;
  },

  /**
   * @deprecated Use getUserSchedule instead. Alias kept for transition period.
   */
  async getAthleteSchedule(athleteId: string) {
    return this.getUserSchedule(athleteId);
  },
};
