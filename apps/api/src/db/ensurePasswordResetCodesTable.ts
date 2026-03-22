import { pool } from "../config/db";

export async function ensurePasswordResetCodesTable() {
  // gen_random_uuid() is provided by pgcrypto
  await pool.query(`CREATE EXTENSION IF NOT EXISTS pgcrypto;`);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS password_reset_codes (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID REFERENCES users(id) ON DELETE CASCADE,
      code VARCHAR(6) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      expires_at TIMESTAMP DEFAULT (CURRENT_TIMESTAMP + INTERVAL '10 minutes'),
      used BOOLEAN DEFAULT FALSE
    );
  `);

  await pool.query(
    `CREATE INDEX IF NOT EXISTS idx_password_reset_codes_user_id ON password_reset_codes(user_id)`
  );

  await pool.query(
    `CREATE INDEX IF NOT EXISTS idx_password_reset_codes_user_id_code ON password_reset_codes(user_id, code)`
  );
}
