import { redis } from "./redis";

/**
 * Creates the Email Service consumer group if it does not already exist.
 */
export async function createConsumerGroup(): Promise<void> {

    try {

        await redis.xgroup(
            "CREATE",
            "email-stream",
            "email-group",
            "0",
            "MKSTREAM"
        );

        console.log("Email Consumer Group Created");

    } catch (error) {

        /**
         * Ignore BUSYGROUP errors because the group
         * already exists.
         */
        if (
            error instanceof Error &&
            error.message.includes("BUSYGROUP")
        ) {
            console.log("Email Consumer Group Already Exists");
            return;
        }

        throw error;

    }

}