import { pool } from "../config/db";

export const ScheduleModel = {
  async getAthleteSchedule(athleteId: string) {
    const res = await pool.query(
      `SELECT ct.id, ct.name, ct.course_code, ct.location, ct.day_of_week, ct.start_time, ct.end_time,
              ct.term, ct.start_date, ct.end_date, ct.recurring,
              act.created_at, act.updated_at
       FROM course_times ct
       JOIN athlete_course_times act ON ct.id = act.class_id
       WHERE act.athlete_id = $1`,
      [athleteId]
    );
    return res.rows;
  },
};
