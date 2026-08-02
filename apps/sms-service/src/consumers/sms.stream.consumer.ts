import {FakeSMSProvider} from "../providers/fake-sms.provider";
import {processSMSEvent} from "./sms.consumer";
import {readSmsStream, ackSmsMessage} from "../lib/stream";
import {publishRetryEvent} from "../events/retry.publisher";
import {canRetry} from "../utils/retry";
import {publishDLQEvent} from "../events/dlq.publisher";
import {getNextRetryCount} from "../utils/retry";
import {logger} from "../lib/logger";

const provider = new FakeSMSProvider();

/**
 * Polls a single message from the SMS stream.
 */
export async function pollOnce(): Promise<void> {

    const response = await readSmsStream(
        "sms-stream",
        "sms-group",
        "sms-consumer-1"
    );

    if (!response || response.length === 0) {
        return;
    }

    const [, messages] = response[0] as any;

    for (const [messageId, values] of messages) {
        const fields = Object.fromEntries(
            Array.from({length: values.length / 2}, (_, i) => [
                values[i * 2],
                values[i * 2 + 1],
            ])
        );

        const event = {
            correlationId: fields.correlationId,
            notificationId: fields.notificationId,
            userId: fields.userId,
            eventType: fields.eventType,
            retryCount: Number(fields.retryCount ?? 0),
        };

        try {

            await processSMSEvent(provider, {
                correlationId: fields.correlationId,
                notificationId: fields.notificationId,
                userId: fields.userId,
                eventType: fields.eventType,
            });

        } catch (error) {

            const retryCount = getNextRetryCount(event.retryCount);

            if (canRetry(retryCount)) {

                await publishRetryEvent({
                    correlationId: fields.correlationId,
                    notificationId: fields.notificationId,
                    userId: fields.userId,
                    eventType: fields.eventType,
                    channel: "SMS",
                    retryCount,
                });

            } else {

                await publishDLQEvent({
                    correlationId: fields.correlationId,
                    notificationId: fields.notificationId,
                    userId: fields.userId,
                    eventType: fields.eventType,
                    channel: "SMS",
                    retryCount,
                });

            }

            throw error;

        }

        await ackSmsMessage(
            "sms-stream",
            "sms-group",
            messageId
        );

    }

}

/**
 * Starts the SMS consumer.
 */
export async function startSMSConsumer(): Promise<void> {

    logger.info("[SMS] Consumer Started");

    while (true) {
        await pollOnce();
    }

}