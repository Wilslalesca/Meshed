import { pool } from "../config/db";

export const VerificationCodeModel = {
  async create(userId: string, code: string) {
    await pool.query(
      `INSERT INTO email_verification_codes (user_id, code)
       VALUES ($1, $2)`,
      [userId, code]
    );
  },

  async findValid(userId: string, code: string) {
    const res = await pool.query(
      `SELECT *
       FROM email_verification_codes
       WHERE user_id = $1
         AND code = $2
         AND used = false
         AND expires_at > NOW()
       ORDER BY created_at DESC
       LIMIT 1`,
      [userId, code]
    );

    return res.rows[0] || null;
  },

  async markUsed(id: string) {
    await pool.query(`UPDATE email_verification_codes SET used = true WHERE id = $1`, [id]);
  },

  async invalidateAllForUser(userId: string) {
    await pool.query(`UPDATE email_verification_codes SET used = true WHERE user_id = $1`, [userId]);
  } 
};
