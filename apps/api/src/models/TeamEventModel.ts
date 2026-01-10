import { pool } from "../config/db";

export type TeamEventInput = {
    team_id: string;
    type: string;
    start_time?: string;
    end_time?: string;
    start_date?: Date;
    end_date?: Date;
    reoccurring:boolean;
    reoccurr_type?:string;
    day_of_week?: string;
    opponent?: string;
    home_away?: string;
    lift_type?: string;
    notes?: string;
    created_at?: string;
    updated_at?: string;
};

export class TeamEventModel {
    static async createTeamEvent(input: TeamEventInput) {
        const { 
            team_id,
            type,
            start_time,
            end_time,
            start_date,
            end_date,
            reoccurring,
            reoccurr_type,
            day_of_week,
            opponent,
            home_away,
            lift_type,
            notes
        } 
        = input;

        const { rows } = await pool.query(
            `INSERT INTO team_events (team_id, type, start_time, end_time, start_date, end_date, reoccurring,
            reoccurr_type, day_of_week, opponent, home_away, lift_type, notes, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, NOW(), NOW())
       RETURNING *`,
            [team_id,
            type,
            start_time,
            end_time,
            start_date,
            end_date,
            reoccurring,
            reoccurr_type,
            day_of_week,
            opponent,
            home_away,
            lift_type,
            notes]
        );

        return rows[0];
    }

    static async getByTeamId(teamId: string) {
        const { rows } = await pool.query(
            `SELECT * FROM team_events WHERE team_id = $1 ORDER BY start_date ASC, start_time ASC`,
            [teamId]
        );
        return rows;
    }
}