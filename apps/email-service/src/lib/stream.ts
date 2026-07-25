import { ackMessage, readStream } from "@repo/core";
import { redis } from "./redis";

/**
 * Reads messages from the email stream.
 */
export async function readEmailStream(
    stream: string,
    group: string,
    consumer: string
) {
    return readStream(redis, stream, group, consumer);
}

/**
 * Acknowledges an email message.
 */
export async function ackEmailMessage(
    stream: string,
    group: string,
    id: string
) {
    return ackMessage(redis, stream, group, id);
}