import { NotificationCreatedEvent } from "@repo/event-contracts";
import { redisPublisher } from "../lib/redis-publisher";
import { randomUUID } from "crypto";
import { logger } from "@repo/logger";


/**
 * Publishes failed email events for retry processing.
*/
export async function publishRetryEvent(
    event: NotificationCreatedEvent
): Promise<void> {
    const retryCount = event.retryCount ?? 0;

    const delaySeconds = Math.pow(2, retryCount);

    const retryEvent: NotificationCreatedEvent = {
        ...event,
        eventId: randomUUID(),
        scheduledAt:
            Date.now() + delaySeconds * 1000,
    };

    logger.info(
        `Retry Scheduled In ${delaySeconds}s`
    );

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
        String(retryEvent.retryCount ?? 0),
        "scheduledAt",
        String(retryEvent.scheduledAt)
    );

    logger.event("Retry Event Published");
}