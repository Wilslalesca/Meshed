import { pool } from "../../config/db";
import type { NotificationRow } from "../../types/notifications";

export async function getUnreadCount(
    organizationId: string,
    userId: string,
): Promise<number> {
    const { rows } = await pool.query<{ count: number }>(
        `
    SELECT COUNT(*)::int AS count
    FROM notifications
    WHERE organization_id = $1 AND user_id = $2 AND read_at IS NULL
    `,
        [organizationId, userId],
    );
    return rows[0]?.count ?? 0;
}

export async function list(
    organizationId: string,
    userId: string,
    opts: { limit: number; cursor?: string },
): Promise<NotificationRow[]> {
    const { rows } = await pool.query<NotificationRow>(
        `
    SELECT id, user_id, type, message, meta, created_at, read_at
    FROM notifications
    WHERE organization_id = $1
      AND user_id = $2
      AND ($3::timestamp IS NULL OR created_at < $3::timestamp)
    ORDER BY created_at DESC
    LIMIT $4
    `,
        [organizationId, userId, opts.cursor ?? null, opts.limit],
    );

    return rows;
}

export async function markRead(
    organizationId: string,
    userId: string,
    id: string,
): Promise<number> {
    const { rowCount } = await pool.query(
        `
    UPDATE notifications
    SET read_at = COALESCE(read_at, NOW())
    WHERE id = $1 AND user_id = $2 AND organization_id = $3
    `,
        [id, userId, organizationId],
    );
    return rowCount ?? 0;
}

export async function markAllRead(
    organizationId: string,
    userId: string,
): Promise<number> {
    const { rowCount } = await pool.query(
        `
    UPDATE notifications
    SET read_at = NOW()
    WHERE user_id = $1 AND organization_id = $2 AND read_at IS NULL
    `,
        [userId, organizationId],
    );
    return rowCount ?? 0;
}

export async function createForUser(
    organizationId: string,
    userId: string,
    type: string,
    message: string,
    meta: object | null,
) {
    const { rows } = await pool.query(
        `
    INSERT INTO notifications (organization_id, user_id, type, message, meta)
    VALUES ($1, $2, $3, $4, $5::jsonb)
    RETURNING id
    `,
        [
            organizationId,
            userId,
            type,
            message,
            meta ? JSON.stringify(meta) : null,
        ],
    );
    return rows[0].id;
}

export async function createForTeam(
    organizationId: string,
    teamId: string,
    type: string,
    message: string,
    meta: object | null,
): Promise<number> {
    const { rowCount } = await pool.query(
        `
    INSERT INTO notifications (organization_id, user_id, type, message, meta)
    SELECT $1, ut.user_id, $3, $4, $5::jsonb
    FROM user_teams ut
    JOIN users u ON u.id = ut.user_id
    JOIN teams t ON t.id = ut.team_id
    WHERE ut.team_id = $2
      AND t.organization_id = $1
      AND ut.status = 'active'
      AND u.active = TRUE
    `,
        [
            organizationId,
            teamId,
            type,
            message,
            meta ? JSON.stringify(meta) : null,
        ],
    );

    return rowCount ?? 0;
}
