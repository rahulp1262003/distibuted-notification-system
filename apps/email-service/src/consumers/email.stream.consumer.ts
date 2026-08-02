import { FakeEmailProvider } from "../providers/fake-email.provider";
import { processEmailEvent } from "./email.consumer";
import { readEmailStream, ackEmailMessage } from "../lib/stream";
import { publishRetryEvent } from "../events/retry.publisher";
import { canRetry } from "../utils/retry";
import { publishDLQEvent } from "../events/dlq.publisher";
import { getNextRetryCount } from "../utils/retry";
import { logger } from "../lib/logger";

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

        const fields = Object.fromEntries(
            Array.from({ length: values.length / 2 }, (_, i) => [
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

            await processEmailEvent(provider, {
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
                    channel: "EMAIL",
                    retryCount,
                });

            } else {

                await publishDLQEvent({
                    correlationId: fields.correlationId,
                    notificationId: fields.notificationId,
                    userId: fields.userId,
                    eventType: fields.eventType,
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

    logger.info("[EMAIL] Consumer Started");

    while (true) {
        await pollOnce();
    }

}