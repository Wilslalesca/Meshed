import { pool } from "../config/db";

export type TeamInput = {
    name: string;
    sport_id?: string | null;
    season?: string | null;
    league_id?: string | null;
    gender?: string | null;
};

export class TeamModel {
    static async createTeam(input: TeamInput) {
        const { name, sport_id, season, league_id, gender } = input;

        const { rows } = await pool.query(
            `INSERT INTO teams (name, sport_id, season, league_id, gender, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, NOW(), NOW())
       RETURNING *`,
            [name, sport_id, season, league_id, gender]
        );

        return rows[0];
    }

    static async getTeam(teamId: string) {
        const { rows } = await pool.query(
            `SELECT * FROM teams WHERE id=$1 LIMIT 1`,
            [teamId]
        );
        return rows[0] ?? null;
    }

    static async getAllTeams() {
        const { rows } = await pool.query(
            `SELECT * FROM teams ORDER BY created_at DESC`
        );
        return rows;
    }

    static async updateTeam(teamId: string, input: TeamInput) {
        const { name, sport_id, season, league_id, gender } = input;

        const { rows } = await pool.query(
            `UPDATE teams
            SET name=$1,
                sport_id=$2,
                season=$3,
                league_id=$4,
                gender=$5,
                updated_at=NOW()
        WHERE id=$6
        RETURNING *`,
            [name, sport_id, season, league_id, gender, teamId]
        );

        return rows[0] ?? null;
    }

    static async deleteTeam(teamId: string) {
        await pool.query(`DELETE FROM teams WHERE id=$1`, [teamId]);
        return true;
    }

    static async findForUser(userId: string) {
        const { rows } = await pool.query(
            `SELECT DISTINCT t.*
                FROM teams t
                WHERE t.id IN (
                    SELECT team_id FROM user_teams WHERE user_id = $1
                    UNION
                    SELECT team_id FROM team_staff WHERE user_id = $1
                )
            ORDER BY t.created_at DESC`,
            [userId]
        );

        return rows;
    }

    static async findall() {
        const { rows } = await pool.query(`SELECT * FROM user_teams`);
        return rows;
    }
}
