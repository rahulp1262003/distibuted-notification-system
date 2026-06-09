/**
 * Published when a notification is created.
 */
export interface NotificationCreatedEvent {
    notificationId: string;
    userId: string;
    eventType: string;
    retryCount?: number;
}