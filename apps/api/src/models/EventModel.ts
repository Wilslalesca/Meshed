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
    status?: string;
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
    static async getAll(organizationId: string) {
        const { rows } = await pool.query(
        `${EVENT_SELECT}
        WHERE te.organization_id = $1
        ORDER BY te.start_date ASC, te.start_time ASC`,
        [organizationId]
        );

        return rows;
    }
    static async getById(id: string, organizationId: string) {
        const { rows } = await pool.query(
        `${EVENT_SELECT}
        WHERE te.id = $1
            AND te.organization_id = $2`,
        [id, organizationId]
        );

        return rows[0] ?? null;
    }

    static async getForFacility(facilityId: string, organizationId: string) {
        const { rows } = await pool.query(
        `${EVENT_SELECT}
        WHERE te.team_facility_id = $1
            AND te.organization_id = $2
        ORDER BY te.start_date ASC, te.start_time ASC`,
        [facilityId, organizationId]
        );

        return rows;
    }

    static async getAllStatusFacilityRequests(facilityId: string, status: string, organizationId: string) {
        const { rows } = await pool.query(
        `${EVENT_SELECT}
        WHERE te.team_facility_id = $1
            AND te.status = $2
            AND te.organization_id = $3
        ORDER BY te.start_date ASC, te.start_time ASC`,
        [facilityId, status, organizationId]
        );
        return rows;
    }

    static async checkConflicts( facilityId: string, startDate: Date, startTime: string, endTime: string, eventId: string, organizationId: string) {
    const { rows } = await pool.query(
      `${EVENT_SELECT}
       WHERE te.team_facility_id = $1
         AND te.start_date = $2
         AND te.start_time <= $4
         AND te.end_time >= $3
         AND te.id != $5
         AND te.organization_id = $6`,
      [facilityId, startDate, startTime, endTime, eventId, organizationId]
    );

    return rows;
  }

  static async updateStatus(id: string, status: string, comments: string, organizationId: string) {
    const response = await pool.query(
      `UPDATE team_events
       SET status = $1,
           updated_at = NOW(),
           facility_notes = $3
       WHERE id = $2
         AND organization_id = $4`,
      [status, id, comments, organizationId]
    );

    return (response.rowCount ?? 0) > 0;
  }
}