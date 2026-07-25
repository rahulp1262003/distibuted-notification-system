import { redis } from "../lib/redis";
import { FanOutEvent } from "@repo/core";
/**
 * Publishes notification events
 * to all downstream channels.
 *
 * @param event Notification event payload.
 */
export async function publishFanOutEvents(
    event: FanOutEvent
): Promise<void> {

    await Promise.all([

        redis.xadd(
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
        ),

        redis.xadd(
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
        ),

        redis.xadd(
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
        ),

    ]);

}