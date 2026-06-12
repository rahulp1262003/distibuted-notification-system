export type NotificationStatusEventType = "notification.sent" | "notification.retrying" | "notification.failed";
export interface NotificationStatusEvent {
    notificationId: string;
    status: "SENT" | "RETRYING" | "FAILED";
}
