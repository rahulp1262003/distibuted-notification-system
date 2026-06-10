import { NotificationCreatedEvent } from "@repo/event-contracts";
import { publishStatusEvent } from "./status.publisher";
import { redisPublisher } from "../lib/redis-publisher";

export async function publishDLQEvent(
    event: NotificationCreatedEvent
): Promise<void> {
    await redisPublisher.xadd(
        "email-dlq",
        "*",
        "notificationId",
        event.notificationId,
        "userId",
        event.userId,
        "eventType",
        event.eventType,
        "retryCount",
        String(event.retryCount ?? 0),
    );

    await publishStatusEvent({
        notificationId: event.notificationId,
        status: "FAILED",
    });

    console.log("Moved To DLQ");
}