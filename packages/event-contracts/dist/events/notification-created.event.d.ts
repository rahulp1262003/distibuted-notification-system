/**
 * Published when a notification is created.
 */
export interface NotificationCreatedEvent {
    eventId: string;
    notificationId: string;
    userId: string;
    eventType: string;
    retryCount?: number;
    scheduledAt?: number;
}
