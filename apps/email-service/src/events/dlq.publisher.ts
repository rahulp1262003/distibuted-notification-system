import Redis from "ioredis";
import { NotificationCreatedEvent } from "@repo/event-contracts";

const redis = new Redis({
    host: "localhost",
    port: 6379,
});

export async function publishDLQEvent(
    event: NotificationCreatedEvent
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
        "retryCount",
        String(event.retryCount ?? 0)
    );

    console.log("Moved To DLQ");
}