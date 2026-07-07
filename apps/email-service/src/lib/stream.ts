import { redis } from "./redis";

/**
 * Reads a single message from a Redis Stream consumer group.
 */
export async function readStream(
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
        0,
        "STREAMS",
        stream,
        ">"
    );

}

/**
 * Acknowledges a processed Redis Stream message.
 *
 * @param stream Redis Stream name.
 * @param group Consumer group name.
 * @param messageId Redis Stream message id.
 */
export async function ackMessage(
    stream: string,
    group: string,
    messageId: string
): Promise<number> {

    return redis.xack(
        stream,
        group,
        messageId
    );

}