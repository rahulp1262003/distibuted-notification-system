import { NotificationCreatedEvent } from "@repo/event-contracts";
import { redisPublisher } from "../lib/redis-publisher";


/**
 * Publishes a notification created event to Redis Stream.
 *
 * @param event NotificationCreatedEvent payload
 */
export async function publishNotificationCreatedEvent(event: NotificationCreatedEvent) {
    await redisPublisher.xadd(
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