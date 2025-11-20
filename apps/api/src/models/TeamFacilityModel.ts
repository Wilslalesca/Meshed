import { pool } from "../config/db";

export class TeamFacilityModel {
  static async link(teamId: string, facilityId: string, isHome = false) {
    const { rows } = await pool.query(
      `INSERT INTO team_facilities (team_id, facility_id, is_home, created_at)
       VALUES ($1, $2, $3, NOW())
       RETURNING *`,
      [teamId, facilityId, isHome]
    );
    return rows[0];
  }

  static async listForTeam(teamId: string) {
    const { rows } = await pool.query(
      `SELECT tf.id,
              tf.is_home,
              f.id AS facility_id,
              f.name,
              f.city,
              f.province_state,
              f.country
         FROM team_facilities tf
         JOIN facilities f ON f.id = tf.facility_id
        WHERE tf.team_id = $1
        ORDER BY tf.is_home DESC, f.name`,
      [teamId]
    );
    return rows;
  }
}
