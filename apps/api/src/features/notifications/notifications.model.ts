import { pool } from "../../config/db";
import type { NotificationRow } from "../../types/notifications";

export async function getUnreadCount(userId: string): Promise<number> {
    const { rows } = await pool.query<{ count: number }>(
        `
    SELECT COUNT(*)::int AS count
    FROM notifications
    WHERE user_id = $1 AND read_at IS NULL
    `,
        [userId],
    );
    return rows[0]?.count ?? 0;
}

export async function list(
    userId: string,
    opts: { limit: number; cursor?: string },
): Promise<NotificationRow[]> {
    const { rows } = await pool.query<NotificationRow>(
        `
    SELECT id, user_id, type, message, meta, created_at, read_at
    FROM notifications
    WHERE user_id = $1
      AND ($2::timestamp IS NULL OR created_at < $2::timestamp)
    ORDER BY created_at DESC
    LIMIT $3
    `,
        [userId, opts.cursor ?? null, opts.limit],
    );

    return rows;
}

export async function markRead(userId: string, id: string): Promise<number> {
  const { rowCount } = await pool.query(
    `
    UPDATE notifications
    SET read_at = COALESCE(read_at, NOW())
    WHERE id = $1 AND user_id = $2
    `,
    [id, userId]
  );
  return rowCount ?? 0;
}


export async function markAllRead(userId: string): Promise<number> {
    const { rowCount } = await pool.query(
        `
    UPDATE notifications
    SET read_at = NOW()
    WHERE user_id = $1 AND read_at IS NULL
    `,
        [userId],
    );
    return rowCount ?? 0;
}

export async function create(
  userId: string,
  type: string,
  message: string,
  meta: object | null
) {
  await pool.query(
    `
    INSERT INTO notifications (user_id, type, message, meta)
    VALUES ($1, $2, $3, $4::jsonb)
    `,
    [userId, type, message, meta ? JSON.stringify(meta) : null]
  );
}
