import { logger } from "../lib/logger";
import { redis } from "../lib/redis";
import { NotificationCreatedEvent } from "@repo/core";

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

    logger.info(
        {
            notificationId: event.notificationId,
            userId: event.userId,
            eventType: event.eventType,
        },
        "Notification event published"
    );
}