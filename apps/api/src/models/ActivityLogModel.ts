import { pool } from "../config/db";

export class ActivityLogModel {
  static async log(organizationId: string, userId: string, action: string, entity: string, entityId: string | null) {
    await pool.query(
      `INSERT INTO activity_log (organization_id, user_id, action, entity, entity_id, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, NOW(), NOW())`,
      [organizationId, userId, action, entity, entityId]
    );
  }
}
