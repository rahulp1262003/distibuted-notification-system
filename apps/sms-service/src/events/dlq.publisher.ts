import { redis } from "../lib/redis";
import { DLQEvent } from "@repo/core";

/**
 * Publishes a failed notification
 * to the Dead Letter Queue.
 *
 * @param event DLQ event payload.
 */
export async function publishDLQEvent(
    event: DLQEvent
): Promise<void> {

    await redis.xadd(
        "sms-dlq",
        "*",
        "notificationId",
        event.notificationId,
        "userId",
        event.userId,
        "eventType",
        event.eventType,
        "channel",
        event.channel,
        "retryCount",
        event.retryCount.toString()
    );

}