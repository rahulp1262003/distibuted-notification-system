import { redis } from "./redis";
import { createConsumerGroup as createGroup } from "@repo/core";
/**
 * Creates the notification consumer group
 * if it does not already exist.
 */
export async function createConsumerGroup(): Promise<void> {

    const created = await createGroup(
        redis,
        "notification-stream",
        "notification-group",
    );

    if (created) {
        console.log("Notification Consumer Group Created");
    } else {
        console.log("Notification Consumer Group Already Exists");
    }

}