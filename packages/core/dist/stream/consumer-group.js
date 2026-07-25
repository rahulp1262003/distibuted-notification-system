"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createConsumerGroup = createConsumerGroup;
/**
 * Creates a Redis Stream consumer group if it does not already exist.
 *
 * @param redis Redis client.
 * @param stream Stream name.
 * @param group Consumer group name.
 */
async function createConsumerGroup(redis, stream, group) {
    try {
        await redis.xgroup("CREATE", stream, group, "0", "MKSTREAM");
        return true;
    }
    catch (error) {
        if (error instanceof Error &&
            error.message.includes("BUSYGROUP")) {
            return false;
        }
        throw error;
    }
}
