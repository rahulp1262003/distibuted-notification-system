import { NotificationCreatedEvent } from "@repo/event-contracts";
import { redisPublisher } from "../lib/redis-publisher";

/**
 * Publishes failed email events for retry processing.
 */
export async function publishRetryEvent(
    event: NotificationCreatedEvent
): Promise<void> {
    await redisPublisher.xadd(
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