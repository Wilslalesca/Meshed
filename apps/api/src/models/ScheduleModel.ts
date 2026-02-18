import { pool } from "../config/db";

export const ScheduleModel = {
  async getAthleteSchedule(athleteId: string) {
    const res = await pool.query(
      `SELECT ct.id, ct.name, ct.course_code, ct.location, ct.day_of_week, ct.start_time, ct.end_time,
              ct.term, ct.start_date, ct.end_date, ct.recurring,
              act.created_at, act.updated_at
       FROM course_times ct
       JOIN user_events act ON ct.id = act.class_id
       WHERE act.user_id = $1`,
      [athleteId]
    );
    return res.rows;
  },

  async getTeamAthleteSchedules(teamId: string) {
    const res = await pool.query(
      `SELECT 
          act.user_id as athlete_id,
          ct.day_of_week,
          ct.start_time,
          ct.end_time
       FROM user_teams ut
       JOIN user_events act ON act.user_id = ut.user_id
       JOIN course_times ct ON ct.id = act.class_id
       WHERE ut.team_id = $1
         AND ut.role = 'athlete'
         AND ut.status = 'active'`,
      [teamId]
    );

    return res.rows;
  },
};
