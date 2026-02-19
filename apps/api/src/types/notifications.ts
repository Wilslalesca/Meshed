export type NotificationType = 
| "Event_Created" 
| "Event_Updated" 
| "Event_Deleted"
| "Event_Conflict"
| "Team_Announcement" 
| "General_Announcement" 
| "Event_Reminder"
| "Team_Invitation"
| "SYSTEM";


export type NotificationMetadata = {
    url?: string;
    sender_id?: string;
    team_id?: string;
    event_id?: string;

    [key: string]: any; // other stuff idk we could add more 
};

export type NotificationRow = {
    id: string;
    user_id: string;
    type: NotificationType;
    message: string;
    meta: NotificationMetadata | null;
    created_at: Date;
    read_at: Date | null;
};