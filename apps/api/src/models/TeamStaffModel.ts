import { pool } from "../config/db";

export class TeamStaffModel {

  static async getStaff(teamId: string) {
    const { rows } = await pool.query(
      `SELECT 
          ts.id,
          ts.user_id,
          ts.role,
          ts.status,
          ts.notes,
          ts.created_at,
          u.first_name,
          u.last_name,
          u.email
       FROM team_staff ts
       JOIN users u ON u.id = ts.user_id
       WHERE ts.team_id = $1
       ORDER BY u.last_name, u.first_name`,
      [teamId]
    );
    return rows;
  }
  static async findStaffRecord(teamId: string, userId: string) {
    const { rows } = await pool.query(
      `SELECT * FROM team_staff WHERE team_id = $1 AND user_id = $2 LIMIT 1`,
      [teamId, userId]
    );
    return rows[0] || null;
  }

  static async addStaff(teamId: string, userId: string, role: string, notes: string | null) {
    const { rows } = await pool.query(
      `INSERT INTO team_staff (team_id, user_id, role, notes, status, created_at, updated_at)
       VALUES ($1, $2, $3, $4, 'pending', NOW(), NOW())
       RETURNING *`,
      [teamId, userId, role, notes]
    );
    return rows[0];
  }

  static async updateStaff(teamId: string, userId: string, fields: { role?: string; notes?: string; status?: string }) {
    const { role = null, notes = null, status = null } = fields;

    const { rows } = await pool.query(
      `UPDATE team_staff
          SET role = COALESCE($1, role),
              notes = COALESCE($2, notes),
              status = COALESCE($3, status),
              updated_at = NOW()
        WHERE team_id = $4 AND user_id = $5
        RETURNING *`,
      [role, notes, status, teamId, userId]
    );

    return rows[0] ?? null;
  }

  static async removeStaff(staffId: string) {
    await pool.query(`DELETE FROM team_staff WHERE id = $1`, [staffId]);
    return true;
  }
}
