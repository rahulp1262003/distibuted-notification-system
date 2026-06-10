import Redis from "ioredis";
import { NotificationCreatedEvent } from "@repo/event-contracts";
import { redisPublisher } from "../lib/redis-publisher";

export async function publishFanOutEvents(
    event: NotificationCreatedEvent,
) {
    await redisPublisher.xadd(
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

    await redisPublisher.xadd(
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

    await redisPublisher.xadd(
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