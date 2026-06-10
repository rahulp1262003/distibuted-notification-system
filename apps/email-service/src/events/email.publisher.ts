import { NotificationCreatedEvent } from "@repo/event-contracts";
import { redisPublisher } from "../lib/redis-publisher";

/**
 * Re-publishes email event for retry.
 */
export async function publishEmailEvent(
  event: NotificationCreatedEvent
): Promise<void> {
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
    event.eventType,
    "retryCount",
    String(event.retryCount ?? 0)
  );

  console.log("Republished To Email Stream");
}