import { NotificationStatusEvent } from "@repo/event-contracts";
import { redisPublisher } from "../lib/redis-publisher";
import { logger } from "@repo/logger";


export async function publishStatusEvent(
    event: NotificationStatusEvent
): Promise<void> {

    await redisPublisher.xadd(
        "notification-status-stream",
        "*",
        "notificationId",
        event.notificationId,
        "status",
        event.status
    );

    logger.event(
        `Status Event Published: ${event.status}`
    );
}