export type NotificationType =
  | "EVENT_CREATED"
  | "EVENT_UPDATED"
  | "EVENT_CANCELLED"
  | "EVENT_CONFLICT"
  | "INVITE_SENT"
  | "INVITE_ACCEPTED"
  | "SYSTEM";

export type NotificationMeta = {
  url?: string;
  teamId?: string;
  eventId?: string;
  facilityId?: string;
  inviteId?: string;
  [key: string]: unknown;
};

export type Notification = {
  id: string;
  type: NotificationType;
  message: string;
  meta: NotificationMeta | null;
  created_at: string; // ISO
  read_at: string | null;
};

export type NotificationListResponse = {
  items: Notification[];
  nextCursor: string | null;
};
