import { redis } from "../lib/redis";

/**
 * Represents a Dead Letter Queue event.
 */
export interface DLQEvent {
    notificationId: string;
    userId: string;
    eventType: string;
    channel: "EMAIL";
    retryCount: number;
}

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
        "email-dlq",
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