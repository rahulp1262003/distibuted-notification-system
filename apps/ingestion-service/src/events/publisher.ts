import Redis from "ioredis";
import { NotificationCreatedEvent } from "@repo/event-contracts";

const redis = new Redis({
    host: "localhost",
    port: 6379,
});

export async function publishFanOutEvents(
    event: NotificationCreatedEvent,
) {
    await redis.xadd(
        "email-stream",
        "*",
        "event",
        "notification.email.send",
        "notificationId",
        event.notificationId,
        "userId",
        event.userId,
        "eventType",
        event.eventType
    );

    await redis.xadd(
        "sms-stream",
        "*",
        "event",
        "notification.sms.send",
        "notificationId",
        event.notificationId,
        "userId",
        event.userId,
        "eventType",
        event.eventType
    );

    await redis.xadd(
        "push-stream",
        "*",
        "event",
        "notification.push.send",
        "notificationId",
        event.notificationId,
        "userId",
        event.userId,
        "eventType",
        event.eventType
    );

    console.log("Fan-Out Completed");
}