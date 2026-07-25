"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.readStream = readStream;
exports.ackMessage = ackMessage;
/**
 * Reads messages from a Redis Stream using a consumer group.
 */
async function readStream(redis, stream, group, consumer) {
    return redis.xreadgroup("GROUP", group, consumer, "COUNT", 1, "BLOCK", 5000, "STREAMS", stream, ">");
}
/**
 * Acknowledges a processed message.
 */
async function ackMessage(redis, stream, group, id) {
    await redis.xack(stream, group, id);
}
