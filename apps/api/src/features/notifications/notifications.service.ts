import * as model from "./notifications.model";

export async function createForUser(organizationId: string, userId: string, type: string, message: string, meta: object | null) {
  return model.createForUser(organizationId, userId, type, message, meta);
}

export async function createForTeam(organizationId: string, teamId: string, type: string, message: string, meta: object | null) {
  return model.createForTeam(organizationId, teamId, type, message, meta);
}


export async function getUnreadCount(organizationId: string, userId: string) {
  return model.getUnreadCount(organizationId, userId);
}

export async function list(
  organizationId: string,
  userId: string,
  opts: { limit: number; cursor?: string }
) {
  const items = await model.list(organizationId, userId, opts);

  const nextCursor =
    items.length === opts.limit ? items[items.length - 1].created_at : null;

  return { items, nextCursor };
}

export async function markRead(organizationId: string, userId: string, id: string) {
  return model.markRead(organizationId, userId, id);
}

export async function markAllRead(organizationId: string, userId: string) {
  return model.markAllRead(organizationId, userId);
}
