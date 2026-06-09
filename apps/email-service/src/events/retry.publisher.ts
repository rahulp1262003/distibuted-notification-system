import Redis from "ioredis";
import { NotificationCreatedEvent } from "@repo/event-contracts";

const redis = new Redis({
    host: "localhost",
    port: 6379,
});

/**
 * Publishes failed email events for retry processing.
 */
export async function publishRetryEvent(
    event: NotificationCreatedEvent
): Promise<void> {
    await redis.xadd(
        "retry-email-stream",
        "*",
        "notificationId",
        event.notificationId,
        "userId",
        event.userId,
        "eventType",
        event.eventType,
        "retryCount",
        String(event.retryCount ?? 0)
    );

    console.log("Retry Event Published");
}