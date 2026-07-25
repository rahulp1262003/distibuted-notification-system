import Redis from "ioredis";

/**
 * Reads messages from a Redis Stream using a consumer group.
 */
export async function readStream(
    redis: Redis,
    stream: string,
    group: string,
    consumer: string
) {
    return redis.xreadgroup(
        "GROUP",
        group,
        consumer,
        "COUNT",
        1,
        "BLOCK",
        5000,
        "STREAMS",
        stream,
        ">"
    );
}

/**
 * Acknowledges a processed message.
 */
export async function ackMessage(
    redis: Redis,
    stream: string,
    group: string,
    id: string
) {
    await redis.xack(stream, group, id);
}