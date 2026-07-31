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

        const event = {
            notificationId: values[3],
            userId: values[5],
            eventType: values[7],
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