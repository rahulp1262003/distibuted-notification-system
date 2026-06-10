import { NotificationCreatedEvent } from "@repo/event-contracts";
import { redisPublisher } from "../lib/redis-publisher";
import { randomUUID } from "crypto";


/**
 * Publishes failed email events for retry processing.
*/
export async function publishRetryEvent(
    event: NotificationCreatedEvent
): Promise<void> {
    const retryEvent: NotificationCreatedEvent = {
        ...event,
        eventId: randomUUID(),
    };
    await redisPublisher.xadd(
        "retry-email-stream",
        "*",
        "eventId",
        retryEvent.eventId,
        "notificationId",
        retryEvent.notificationId,
        "userId",
        retryEvent.userId,
        "eventType",
        retryEvent.eventType,
        "retryCount",
        String(retryEvent.retryCount ?? 0)
    );

    console.log("Retry Event Published");
}