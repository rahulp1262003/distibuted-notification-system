import { redis } from "../lib/redis";
import { RetryEvent } from "@repo/core";
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