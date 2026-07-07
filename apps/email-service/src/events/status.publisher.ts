import { redis } from "../lib/redis";

/**
 * Represents the notification status event.
 */
export interface NotificationStatusEvent {
    notificationId: string;
    channel: "EMAIL";
    status: "SENT" | "FAILED";
}

/**
 * Publishes notification status to Redis Stream.
 *
 * @param event Notification status event.
 */
export async function publishStatusEvent(
    event: NotificationStatusEvent
): Promise<void> {

    await redis.xadd(
        "notification-status-stream",
        "*",
        "notificationId",
        event.notificationId,
        "channel",
        event.channel,
        "status",
        event.status
    );

}