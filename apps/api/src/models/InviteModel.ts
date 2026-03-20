import { pool } from "../config/db";

export class InviteModel {
  static async createInvite(organizationId: string, teamId: string, email: string, role: string | null, position: string | null, token: string) {
    const { rows } = await pool.query(
      `INSERT INTO invites (organization_id, team_id, email, token, role, position)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [organizationId, teamId, email, token, role, position]
    );
    return rows[0];
  }

  static async findByToken(token: string) {
    const { rows } = await pool.query(
      `SELECT * FROM invites WHERE token = $1 LIMIT 1`,
      [token]
    );
    return rows[0] ?? null;
  }
   static async findByTokenAndOrganization(token: string, organizationId: string) {
      const { rows } = await pool.query(
        `SELECT *
        FROM invites
        WHERE token = $1
          AND organization_id = $2
        LIMIT 1`,
        [token, organizationId]
      );

      return rows[0] ?? null;
  }

  static async markAccepted(inviteId: string, organizationId: string) {
    await pool.query(
      `UPDATE invites
       SET status = 'accepted',
           accepted_at = NOW()
       WHERE id = $1
         AND organization_id = $2`,
      [inviteId, organizationId]
    );
  }
}
