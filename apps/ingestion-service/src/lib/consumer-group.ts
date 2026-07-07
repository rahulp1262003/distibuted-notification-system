import { redis } from "./redis";

/**
 * Creates the notification consumer group
 * if it does not already exist.
 */
export async function createConsumerGroup(): Promise<void> {

    try {

        await redis.xgroup(
            "CREATE",
            "notification-stream",
            "notification-group",
            "0",
            "MKSTREAM"
        );

        console.log("Notification Consumer Group Created");

    } catch (error) {

        if (
            error instanceof Error &&
            error.message.includes("BUSYGROUP")
        ) {
            console.log("Notification Consumer Group Already Exists");
            return;
        }

        throw error;

    }

}