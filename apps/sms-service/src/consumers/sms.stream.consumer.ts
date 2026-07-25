import { FakeSMSProvider } from "../providers/fake-sms.provider";
import { processSMSEvent } from "./sms.consumer";
import { readSmsStream, ackSmsMessage } from "../lib/stream";
import { publishRetryEvent } from "../events/retry.publisher";
import { canRetry } from "../utils/retry";
import { publishDLQEvent } from "../events/dlq.publisher";
import { getNextRetryCount } from "../utils/retry";

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

        const event = {
            notificationId: values[3],
            userId: values[5],
            eventType: values[7],
            retryCount: values[9] ? Number(values[9]) : 0,
        };

        try {

            await processSMSEvent(provider, {
                notificationId: values[3],
                userId: values[5],
                eventType: values[7],
            });

        } catch (error) {

            const retryCount = getNextRetryCount(event.retryCount);

            if (canRetry(retryCount)) {

                await publishRetryEvent({
                    notificationId: event.notificationId,
                    userId: event.userId,
                    eventType: event.eventType,
                    channel: "SMS",
                    retryCount,
                });

            } else {

                await publishDLQEvent({
                    notificationId: event.notificationId,
                    userId: event.userId,
                    eventType: event.eventType,
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

    console.log("[SMS] Consumer Started");

    while (true) {
        await pollOnce();
    }

}