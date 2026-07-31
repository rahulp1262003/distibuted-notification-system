import { logger } from "./logger";
import { redis } from "./redis";
import { createConsumerGroup as createGroup } from "@repo/core";
/**
 * Creates the Email Service consumer group if it does not already exist.
 */
export async function createConsumerGroup(): Promise<void> {

    const created = await createGroup(
        redis,
        "email-stream",
        "email-group"
    );

    if (created) {
        logger.info("Email Consumer Group Created");
    } else {
        logger.warn("Email Consumer Group Already Exists");
    }

}