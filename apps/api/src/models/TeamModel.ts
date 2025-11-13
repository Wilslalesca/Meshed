// apps/api/src/models/TeamModel.ts
import { pool } from "../config/db";

export type TeamInput = {
  name: string;
  sport_id?: string | null;
  season?: string | null;
  league_id?: string | null;
};

export class TeamModel {
  static async findForUser(userId: string) {
    const { rows } = await pool.query(
      `SELECT t.*
         FROM user_teams ut
         JOIN teams t ON t.id = ut.team_id
        WHERE ut.user_id = $1
        ORDER BY t.name`,
      [userId]
    );
    return rows;
  }

  static async create(input: TeamInput) {
    const { name, sport_id = null, season = null, league_id = null } = input;

    const { rows } = await pool.query(
      `INSERT INTO teams (name, sport_id, season, league_id, created_at, updated_at)
       VALUES ($1, $2, $3, $4, NOW(), NOW())
       RETURNING *`,
      [name, sport_id, season, league_id]
    );

    return rows[0];
  }

  static async addManagerToTeam(userId: string, teamId: string) {
    await pool.query(
      `INSERT INTO user_teams (user_id, team_id, role, position, status, joined_at, updated_at)
       VALUES ($1, $2, 'manager', NULL, 'active', NOW(), NOW())
       ON CONFLICT DO NOTHING`,
      [userId, teamId]
    );
  }
    static async addAthlete(teamId: string, userId: string) {
      // ensure athlete_profile exists for this user (optional but nice)
      const prof = await pool.query(
        `SELECT 1 FROM athlete_profiles WHERE id = $1`,
        [userId]
      );
      if (!prof.rows[0]) {
        throw new Error("User does not have an athlete profile");
      }

      await pool.query(
        `INSERT INTO user_teams (user_id, team_id, role, position, status, joined_at, updated_at)
        VALUES ($1, $2, 'athlete', NULL, 'active', NOW(), NOW())
        ON CONFLICT DO NOTHING`,
        [userId, teamId]
      );
    }

    static async getAthletes(teamId: string) {
      const { rows } = await pool.query(
        `SELECT u.id,
                u.first_name,
                u.last_name,
                u.email,
                ut.role,
                ut.position,
                ut.status,
                ut.joined_at
          FROM user_teams ut
          JOIN users u ON u.id = ut.user_id
          WHERE ut.team_id = $1
            AND ut.role = 'athlete'
          ORDER BY u.last_name, u.first_name`,
        [teamId]
      );
      return rows;
  }
}
