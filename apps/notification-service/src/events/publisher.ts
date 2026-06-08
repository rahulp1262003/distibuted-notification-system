import { redis } from "../lib/redis";

export async function publishNotificationCreatedEvent(
    notificationId: string,
    userId: string,
    eventType: string
) {
    await redis.xadd(
        "notification-stream",
        "*",
        "event",
        "notification.created",
        "notificationId",
        notificationId,
        "userId",
        userId,
        "eventType",
        eventType
    );
}