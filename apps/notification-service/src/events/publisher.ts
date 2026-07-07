import { redis } from "../lib/redis";
/**
 * Notification created event.
 */
export interface NotificationCreatedEvent {
    notificationId: string;
    userId: string;
    eventType: string;
}

/**
 * Publishes a notification created event to Redis Stream.
 *
 * @param event NotificationCreatedEvent payload
 */
export async function publishNotificationCreatedEvent(event: NotificationCreatedEvent) {
    await redis.xadd(
        "notification-stream",
        "*",
        "event",
        "notification.created",
        "notificationId",
        event.notificationId,
        "userId",
        event.userId,
        "eventType",
        event.eventType
    );
}