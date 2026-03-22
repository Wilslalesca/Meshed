import { pool } from "../config/db";

export const AthleteModel = {
    async getAthleteById(athleteId: string, organizationId: string) {
        const res = await pool.query(
            `SELECT 
        u.id,
        u.first_name,
        u.last_name,
        u.email,
        ut.role,
        ut.position,
        ut.status,
        ut.joined_at,
        ap.school_name,
        ap.year,
        ap.notes
      FROM users u
      LEFT JOIN user_teams ut ON ut.user_id = u.id
      LEFT JOIN teams t ON t.id = ut.team_id
      LEFT JOIN athlete_profiles ap ON ap.id = u.id
      WHERE u.id = $1
        AND t.organization_id = $2
      LIMIT 1`,
            [athleteId, organizationId],
        );

        return res.rows[0] ?? null;
    },
};
