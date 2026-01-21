import { pool } from "../config/db";

export class NotificationModel {
  static async create(userId: string, type: string, message: string, meta: any = null) {
    await pool.query(
      `INSERT INTO notifications (user_id, type, message, meta, created_at)
       VALUES ($1, $2, $3, $4::jsonb, NOW())`,
      [userId, type, message, meta ? JSON.stringify(meta) : null]
    );
  }

  static async getUnreadForUser(userId: string) {
    const { rows } = await pool.query(
      `SELECT id, type, message, meta, created_at
       FROM notifications
       WHERE user_id = $1 AND read_at IS NULL
       ORDER BY created_at DESC`,
      [userId]
    );
    return rows;
  }

  static async markAllReadForUser(userId: string) {
    await pool.query(
      `UPDATE notifications SET read_at = NOW() WHERE user_id = $1 AND read_at IS NULL`,
      [userId]
    );
  }
}
