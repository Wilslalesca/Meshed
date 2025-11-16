import { pool } from "../config/db";

export class ActivityLogModel {
  static async log(userId: string, action: string, entity: string, entityId: string | null) {
    await pool.query(
      `INSERT INTO activity_log (user_id, action, entity, entity_id, created_at, updated_at)
       VALUES ($1, $2, $3, $4, NOW(), NOW())`,
      [userId, action, entity, entityId]
    );
  }
}
