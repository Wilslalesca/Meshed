import { pool } from "../config/db";

export class InviteModel {
    static async createInvite(
        teamId: string,
        email: string,
        role: string | null,
        position: string | null,
        code: string
    ) {
        await pool.query(
            `DELETE FROM invites WHERE email = $1 AND team_id = $2`,
            [email, teamId]
        );

        const { rows } = await pool.query(
            `INSERT INTO invites (team_id, email, token, role, position, status, sent_at)
       VALUES ($1, $2, $3, $4, $5, 'pending', NOW())
       RETURNING *`,
            [teamId, email, code, role, position]
        );
        return rows[0];
    }

    static async findValidInvite(email: string, code: string) {
        const { rows } = await pool.query(
            `SELECT * FROM invites
       WHERE email = $1
         AND token = $2
         AND status = 'pending'
         AND sent_at >= NOW() - INTERVAL '24 hours'
       LIMIT 1`,
            [email, code]
        );
        return rows[0] ?? null;
    }

    static async markAccepted(inviteId: string) {
        await pool.query(
            `UPDATE invites
       SET status = 'accepted',
           accepted_at = NOW()
       WHERE id = $1`,
            [inviteId]
        );
    }
}
