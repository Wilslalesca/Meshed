import { pool } from "../config/db";


export type TeamEventInput = {
    team_id: string;
    team_facility_id?: string;
    requested_by_user_id?: string;
    name?: string;
    type: string;
    start_time?: string;
    end_time?: string;
    start_date?: Date;
    end_date?: Date;
    reoccurring: boolean;
    reoccurr_type?: string;
    day_of_week?: string;
    status?: string;
    opponent?: string;
    home_away?: string;
    lift_type?: string;
    notes?: string;
    created_at?: string;
    updated_at?: string;
};

export class TeamEventModel {
    static async createTeamEvent(input: TeamEventInput, organizationId: string) {
        const { 
            team_id,
            team_facility_id,
            requested_by_user_id,
            name,
            type,
            start_time,
            end_time,
            start_date,
            end_date,
            reoccurring,
            reoccurr_type,
            day_of_week,
            status,
            opponent,
            home_away,
            lift_type,
            notes,
        } = input;

        const { rows } = await pool.query(
        `INSERT INTO team_events (
            organization_id, team_id, team_facility_id, requested_by_user_id, name, type, start_time, end_time,
            start_date, end_date, reoccurring, reoccurr_type, day_of_week, status, opponent,
            home_away, lift_type, notes, created_at, updated_at
        )
        VALUES (
            $1, $2, $3, $4, $5, $6, $7, $8, $9, $10,
            $11, $12, $13, $14, $15, $16, $17, $18, NOW(), NOW()
        )
        RETURNING *`,
        [
            organizationId,
            team_id,
            team_facility_id ?? null,
            requested_by_user_id ?? null,
            name ?? null,
            type,
            start_time ?? null,
            end_time ?? null,
            start_date ?? null,
            end_date ?? null,
            reoccurring,
            reoccurr_type ?? null,
            day_of_week ?? null,
            status ?? null,
            opponent ?? null,
            home_away ?? null,
            lift_type ?? null,
            notes ?? null,
        ]
        );

        return rows[0];
    }

    static async getByTeamId(teamId: string, organizationId: string) {
        const { rows } = await pool.query(
        `SELECT *
        FROM team_events
        WHERE team_id = $1
            AND organization_id = $2
        ORDER BY start_date ASC, start_time ASC`,
        [teamId, organizationId]
        );

        return rows;
    }
}