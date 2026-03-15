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

const EVENT_SELECT = `
    SELECT
        te.*,
        u.id AS requested_by_user_id,
        CONCAT_WS(' ', u.first_name, u.last_name) AS requested_by_name,
        u.email AS requested_by_email
    FROM team_events te
    LEFT JOIN users u
        ON te.requested_by_user_id = u.id
`;

export class EventModel {
    static async getAll() {
        const { rows } = await pool.query(
            `${EVENT_SELECT}
             ORDER BY te.start_date ASC, te.start_time ASC`
        );
        return rows;
    }

    static async getForFacility(facilityId: string) {
        const { rows } = await pool.query(
            `${EVENT_SELECT}
             WHERE te.team_facility_id = $1
             ORDER BY te.start_date ASC, te.start_time ASC`,
            [facilityId]
        );
        return rows;
    }

    static async getAllStatusFacilityRequests(facilityId: string, status: string) {
        const { rows } = await pool.query(
            `${EVENT_SELECT}
             WHERE te.team_facility_id = $1
             AND te.status = $2
             ORDER BY te.start_date ASC, te.start_time ASC`,
            [facilityId, status]
        );
        return rows;
    }

    static async checkConflicts(
        facilityId: string,
        startDate: Date,
        startTime: string,
        endTime: string,
        eventId: string
    ) {
        const { rows } = await pool.query(
            `${EVENT_SELECT}
             WHERE te.team_facility_id = $1
             AND te.start_date = $2
             AND te.start_time <= $4
             AND te.end_time >= $3
             AND te.id != $5`,
            [facilityId, startDate, startTime, endTime, eventId]
        );
        return rows;
    }

    static async updateStatus(id: string, status: string, comments: string) {
        const response = await pool.query(
            `UPDATE team_events
             SET status = $1, updated_at = NOW(), facility_notes = $3
             WHERE id = $2`,
            [status, id, comments]
        );
        return (response.rowCount ?? 0) > 0;
    }
}