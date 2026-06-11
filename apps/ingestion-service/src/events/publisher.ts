import Redis from "ioredis";
import { NotificationCreatedEvent } from "@repo/event-contracts";
import { redisPublisher } from "../lib/redis-publisher";
import { logger } from "@repo/logger";

export async function publishFanOutEvents(
    event: NotificationCreatedEvent,
) {
    await redisPublisher.xadd(
        "email-stream",
        "*",
        "eventId",
        event.eventId,
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
        "eventId",
        event.eventId,
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
        "eventId",
        event.eventId,
        "event",
        "notification.push.send",
        "notificationId",
        event.notificationId,
        "userId",
        event.userId,
        "eventType",
        event.eventType
    );

    logger.success("Fan-Out Completed");
}