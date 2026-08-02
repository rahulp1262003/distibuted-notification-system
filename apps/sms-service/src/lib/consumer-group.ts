import { redis } from "./redis";
import { createConsumerGroup as createGroup } from "@repo/core";
import {logger} from "./logger";
/**
 * Creates the SMS Service consumer group if it does not already exist.
 */
export async function createConsumerGroup(): Promise<void> {

    const created = await createGroup(
        redis,
        "sms-stream",
        "sms-group",
    );

    if (created) {
        logger.info("SMS Consumer Group Created");
    } else {
        logger.warn("SMS Consumer Group Already Exists");
    }

}