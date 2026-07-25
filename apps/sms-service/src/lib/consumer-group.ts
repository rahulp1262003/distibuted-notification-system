import { redis } from "./redis";
import { createConsumerGroup as createGroup } from "@repo/core";
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
        console.log("SMS Consumer Group Created");
    } else {
        console.log("SMS Consumer Group Already Exists");
    }

}