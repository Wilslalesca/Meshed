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
    status?:boolean;
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

    static async getForFacility(facilityId: string) {
        const { rows } = await pool.query(
            `SELECT * FROM team_events WHERE team_facility_id = $1 ORDER BY start_date ASC, start_time ASC`, [facilityId]
        );
        return rows;
    }

    static async getAllStatusFacilityRequests(facilityId: string, status:string) {
        const { rows } = await pool.query(
            `SELECT * FROM team_events WHERE team_facility_id = $1 AND status = $2 ORDER BY start_date ASC, start_time ASC`, [facilityId, status]
        );
        return rows;
    }

    static async checkConflicts(facilityId :string, startDate:Date, startTime:string , endTime:string, eventId: string) {
        const { rows } = await pool.query(
            `SELECT * 
            FROM team_events as t
            WHERE team_facility_id = $1 
            AND start_date = $2
            AND t.start_time <= $4 AND t.end_time >= $3
            AND id != $5
            `,[facilityId, startDate, startTime, endTime, eventId]
        );
        return rows;
    }

    static async updateStatus(id:string, status:string){
        const response = await pool.query(
            `UPDATE team_events
            SET status = $1, updated_at = NOW()
            WHERE id = $2`,
            [status, id]
        );
        return (response.rowCount ?? 0) > 0;
    }
}