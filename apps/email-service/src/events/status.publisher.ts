import { NotificationStatusEvent } from "@repo/event-contracts";
import { redisPublisher } from "../lib/redis-publisher";


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

    console.log(
        `Status Event Published: ${event.status}`
    );
}