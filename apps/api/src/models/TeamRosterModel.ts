import { pool } from "../config/db";

export class TeamRosterModel {
    static async getAthletes(teamId: string) {
        const { rows } = await pool.query(
            `SELECT 
                u.id,
                u.first_name,
                u.last_name,
                u.email,
                ut.role,
                ut.position,
                ut.status,
                ut.joined_at
            FROM user_teams ut
            JOIN users u ON u.id = ut.user_id
            WHERE ut.team_id = $1 AND ut.role = 'athlete'
            ORDER BY u.last_name, u.first_name`,
            [teamId]
        );

        return rows;
    }

    static async updateAthlete(
        teamId: string,
        userId: string,
        fields: { position?: string; status?: string }
    ) {
        const { position = null, status = null } = fields;

        const { rows } = await pool.query(
            `UPDATE user_teams
                SET position = COALESCE($1, position),
                status   = COALESCE($2, status),
                updated_at = NOW()
                WHERE team_id = $3 AND user_id = $4 AND role = 'athlete'
                RETURNING *`,
            [position, status, teamId, userId]
        );
        return rows[0] ?? null;
    }

    static async addAthlete(
        teamId: string,
        userId: string,
        position: string | null = null
    ) {
        await pool.query(
            `INSERT INTO user_teams (user_id, team_id, role, position, status, joined_at, updated_at)
         VALUES ($1, $2, 'athlete', $3, 'active', NOW(), NOW())
         ON CONFLICT (user_id, team_id) DO NOTHING`,
            [userId, teamId, position]
        );
    }

    static async removeAthlete(teamId: string, userId: string) {
        await pool.query(
            `DELETE FROM user_teams
         WHERE user_id = $1 AND team_id = $2 AND role = 'athlete'`,
            [userId, teamId]
        );
    }
}
