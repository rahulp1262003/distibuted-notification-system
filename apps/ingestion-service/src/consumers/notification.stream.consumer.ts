import { processNotificationEvent } from "./notification.consumer";
import { ackMessage, readStream } from "../lib/stream";
import { logger } from "../lib/logger";

/**
 * Polls the notification stream once.
 */
export async function pollOnce(): Promise<void> {

    const response = await readStream(
        "notification-stream",
        "notification-group",
        "notification-consumer-1"
    );

    if (!response || response.length === 0) {
        return;
    }

    const [, messages] = response[0] as any;

    if (!messages.length) {
        return;
    }

    for (const [messageId, values] of messages) {

        const fields = Object.fromEntries(
            Array.from({ length: values.length / 2 }, (_, i) => [
                values[i * 2],
                values[i * 2 + 1],
            ])
        );

        logger.info(fields);

        const event = {
            correlationId: fields.correlationId,
            notificationId: fields.notificationId,
            userId: fields.userId,
            eventType: fields.eventType,
        };

        await processNotificationEvent(event);

        await ackMessage(
            "notification-stream",
            "notification-group",
            messageId
        );

    }

}

/**
 * Starts continuously polling the notification stream.
 */
export async function startNotificationConsumer(): Promise<void> {

    logger.info("[INGESTION] Consumer Started");

    while (true) {
        await pollOnce();
    }

}