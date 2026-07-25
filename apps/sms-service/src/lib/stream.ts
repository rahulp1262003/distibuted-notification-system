import { ackMessage, readStream } from "@repo/core";
import { redis } from "./redis";

/**
 * Reads messages from the SMS stream.
 */
export async function readSmsStream(
    stream: string,
    group: string,
    consumer: string
) {
    return readStream(redis, stream, group, consumer);
}

/**
 * Acknowledges an SMS message.
 */
export async function ackSmsMessage(
    stream: string,
    group: string,
    id: string
) {
    return ackMessage(redis, stream, group, id);
}