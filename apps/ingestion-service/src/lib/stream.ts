import { redis } from "./redis";

/**
 * Reads a single message from a Redis Stream consumer group.
 *
 * @param stream Stream name.
 * @param group Consumer group.
 * @param consumer Consumer name.
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
 * Acknowledges a processed stream message.
 *
 * @param stream Stream name.
 * @param group Consumer group.
 * @param messageId Stream message id.
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