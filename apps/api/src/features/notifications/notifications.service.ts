import * as model from "./notifications.model";


export async function create(userId: string, type: string, message: string, meta: object | null) {
  await model.create(userId, type, message, meta);
}

export async function getUnreadCount(userId: string) {
  return model.getUnreadCount(userId);
}

export async function list(
  userId: string,
  opts: { limit: number; cursor?: string }
) {
  const items = await model.list(userId, opts);

  const nextCursor =
    items.length === opts.limit ? items[items.length - 1].created_at : null;

  return { items, nextCursor };
}

export async function markRead(userId: string, id: string) {
  return model.markRead(userId, id);
}

export async function markAllRead(userId: string) {
  return model.markAllRead(userId);
}
