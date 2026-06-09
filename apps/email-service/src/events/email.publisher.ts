import Redis from "ioredis";
import { NotificationCreatedEvent } from "@repo/event-contracts";

const redis = new Redis({
  host: "localhost",
  port: 6379,
});

/**
 * Re-publishes email event for retry.
 */
export async function publishEmailEvent(
  event: NotificationCreatedEvent
): Promise<void> {
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
    event.eventType,
    "retryCount",
    String(event.retryCount ?? 0)
  );

  console.log("Republished To Email Stream");
}