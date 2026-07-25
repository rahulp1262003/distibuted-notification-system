import { FakeEmailProvider } from "../providers/fake-email.provider";
import { processEmailEvent } from "./email.consumer";
import { readEmailStream, ackEmailMessage } from "../lib/stream";
import { publishRetryEvent } from "../events/retry.publisher";
import { canRetry } from "../utils/retry";
import { publishDLQEvent } from "../events/dlq.publisher";
import { getNextRetryCount } from "../utils/retry";

const provider = new FakeEmailProvider();

/**
 * Polls a single message from the email stream.
 */
export async function pollOnce(): Promise<void> {

    const response = await readEmailStream(
        "email-stream",
        "email-group",
        "email-consumer-1"
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

            await processEmailEvent(provider, {
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
                    channel: "EMAIL",
                    retryCount,
                });

            } else {

                await publishDLQEvent({
                    notificationId: event.notificationId,
                    userId: event.userId,
                    eventType: event.eventType,
                    channel: "EMAIL",
                    retryCount,
                });

            }

            throw error;

        }

        await ackEmailMessage(
            "email-stream",
            "email-group",
            messageId
        );

    }

}

/**
 * Starts the email consumer.
 */
export async function startEmailConsumer(): Promise<void> {

    console.log("[EMAIL] Consumer Started");

    while (true) {
        await pollOnce();
    }

}