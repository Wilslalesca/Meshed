import { pool } from "../config/db";

export type TeamEventInput = {
    team_id: string;
    team_facility_id?:string;
    name?:string;
    type: string;
    start_time?: string;
    end_time?: string;
    start_date?: Date;
    end_date?: Date;
    reoccurring:boolean;
    reoccurr_type?:string;
    day_of_week?: string;
    approved?:boolean;
    opponent?: string;
    home_away?: string;
    lift_type?: string;
    notes?: string;
    created_at?: string;
    updated_at?: string;
};

export class EventModel {
    static async getAll() {
        const { rows } = await pool.query(
            `SELECT * FROM team_events ORDER BY start_date ASC, start_time ASC`,
        );
        return rows;
    }
}