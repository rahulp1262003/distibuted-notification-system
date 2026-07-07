import { redis } from "../lib/redis";

/**
 * Represents a retry event.
 */
export interface RetryEvent {
    notificationId: string;
    userId: string;
    eventType: string;
    channel: "EMAIL";
    retryCount: number;
}

/**
 * Publishes a retry event to the retry stream.
 *
 * @param event Retry event payload.
 */
export async function publishRetryEvent(
    event: RetryEvent
): Promise<void> {

    await redis.xadd(
        "retry-stream",
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