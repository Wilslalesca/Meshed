import { pool } from "../config/db";

type PostgresErrorWithCode = {
  code: string;
};

function isPostgresErrorWithCode(err: unknown): err is PostgresErrorWithCode {
  return (
    typeof err === "object" &&
    err !== null &&
    "code" in err &&
    typeof (err as { code: unknown }).code === "string"
  );
}

export class EventEmailLogModel {
  static async tryCreateLog(teamEventId: string, emailType: string, recipientEmail: string): Promise<boolean> {
    try {
      await pool.query(
        `INSERT INTO team_event_email_log (team_event_id, email_type, recipient_email)
         VALUES ($1, $2, $3)`,
        [teamEventId, emailType, recipientEmail]
      );
      return true;
    } catch (err: unknown) {
      if (isPostgresErrorWithCode(err) && err.code === "23505") {
        return false;
      }
      throw err;
    }
  }
}