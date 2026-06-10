import { NotificationStatusEvent } from "@repo/event-contracts";
import { redisPublisher } from "../lib/redis-publisher";


export async function publishStatusEvent(
    event: NotificationStatusEvent
): Promise<void> {

    console.log("Before Status Publish");

    await redisPublisher.xadd(
        "notification-status-stream",
        "*",
        "notificationId",
        event.notificationId,
        "status",
        event.status
    );

    console.log("After Status Publish");

    console.log(
        `Status Event Published: ${event.status}`
    );
}