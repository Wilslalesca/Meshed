import { pool } from "../config/db";

export type TeamInput = {
    name: string;
    sport_id?: string | null;
    season?: string | null;
    league_id?: string | null;
    gender?: string | null;
};

export class TeamModel {
    static async findForUser(userId: string) {
        const { rows } = await pool.query(
            `SELECT t.*
         FROM user_teams ut
         JOIN teams t ON t.id = ut.team_id
        WHERE ut.user_id = $1
        ORDER BY t.created_at DESC`,
            [userId]
        );
        return rows;
    }

    static async create(input: TeamInput) {
        const { name, sport_id, season, league_id, gender } = input;

        const { rows } = await pool.query(
            `INSERT INTO teams (name, sport_id, season, league_id, gender, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, NOW(), NOW())
       RETURNING *`,
            [
                name,
                sport_id || null,
                season || null,
                league_id || null,
                gender || null,
            ]
        );

        return rows[0];
    }

    static async findById(teamId: string) {
        const { rows } = await pool.query(
            `SELECT * FROM teams WHERE id=$1 LIMIT 1`,
            [teamId]
        );
        return rows[0] ?? null;
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

    static async getAthletes(teamId: string) {
        const { rows } = await pool.query(
            `SELECT u.id, u.first_name, u.last_name, u.email,
              ut.role, ut.position, ut.status, ut.joined_at
         FROM user_teams ut
         JOIN users u ON u.id = ut.user_id
        WHERE ut.team_id = $1 AND ut.role = 'athlete'
        ORDER BY u.last_name, u.first_name`,
            [teamId]
        );
        return rows;
    }

    static async addUserToTeam(
        teamId: string,
        userId: string,
        role: string,
        position: string | null,
        status: string
    ) {
        await pool.query(
            `INSERT INTO user_teams (user_id, team_id, role, position, status, joined_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, NOW(), NOW())
       ON CONFLICT (user_id, team_id) DO NOTHING`,
            [userId, teamId, role, position, status]
        );
    }

    static async updateUserStatus(
        teamId: string,
        userId: string,
        status: string
    ) {
        await pool.query(
            `UPDATE user_teams
          SET status=$3,
              updated_at=NOW()
        WHERE user_id=$1 AND team_id=$2`,
            [userId, teamId, status]
        );
    }

    static async addAthlete(teamId: string, userId: string) {
        const prof = await pool.query(
            `SELECT 1 FROM athlete_profiles WHERE id=$1`,
            [userId]
        );
        if (!prof.rows[0])
            throw new Error("User does not have an athlete profile");

        await TeamModel.addUserToTeam(
            teamId,
            userId,
            "athlete",
            null,
            "active"
        );
    }

    static async removeAthlete(teamId: string, userId: string) {
      await pool.query(
        `DELETE FROM user_teams
        WHERE user_id=$1 AND team_id=$2 AND role='athlete'`,
        [userId, teamId]
      );
    }

    static async addStaff(teamId: string, userId: string, role: string, notes: string | null) {
      await pool.query(
        `INSERT INTO team_staff (user_id, team_id, role, notes)
        VALUES ($1, $2, $3, $4)`,
        [userId, teamId, role, notes]
      );
    }

    static async getStaff(teamId: string) {
      const { rows } = await pool.query(
        `SELECT ts.id, u.id AS user_id, u.first_name, u.last_name, u.email,
                ts.role, ts.status, ts.notes, ts.created_at
        FROM team_staff ts
        JOIN users u ON u.id = ts.user_id
        WHERE ts.team_id=$1
        ORDER BY u.last_name, u.first_name`,
        [teamId]
      );
      return rows;
    }

    static async updateStaff(staffId: string, role: string | null, notes: string | null) {
      const { rows } = await pool.query(
        `UPDATE team_staff
        SET role=$1, notes=$2, updated_at=NOW()
        WHERE id=$3
        RETURNING *`,
        [role, notes, staffId]
      );
      return rows[0] ?? null;
    }
    static async deleteStaff(staffId: string) {
      await pool.query(`DELETE FROM team_staff WHERE id=$1`, [staffId]);
      return true;
    }
}
