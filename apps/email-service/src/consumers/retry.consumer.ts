import { NotificationCreatedEvent } from "@repo/event-contracts";
import { publishEmailEvent } from "../events/email.publisher";
import { publishDLQEvent } from "../events/dlq.publisher";
import { redisConsumer } from "../lib/redis-consumer";

/**
 * Creates consumer group for retry-email-stream.
 */
async function createRetryConsumerGroup(): Promise<void> {
    try {
        await redisConsumer.xgroup(
            "CREATE",
            "retry-email-stream",
            "retry-email-group",
            "0",
            "MKSTREAM"
        );

        console.log("Retry Consumer Group Created");
    } catch (error: any) {
        if (error.message.includes("BUSYGROUP")) {
            console.log("Retry Consumer Group Already Exists");
            return;
        }

        throw error;
    }
}

/**
 * Consumes retry events.
 */
async function consumeRetries(): Promise<void> {
    await createRetryConsumerGroup();

    while (true) {
        const response = await redisConsumer.xreadgroup(
            "GROUP",
            "retry-email-group",
            "retry-consumer-1",
            "COUNT",
            10,
            "BLOCK",
            0,
            "STREAMS",
            "retry-email-stream",
            ">"
        );

        if (!response) continue;

        const [, messages] = (response as any)[0];

        for (const [messageId, fields] of messages) {
            const eventData = Object.fromEntries(
                Array.from({ length: fields.length / 2 }, (_, i) => [
                    fields[i * 2],
                    fields[i * 2 + 1],
                ])
            );

            const event: NotificationCreatedEvent = {
                eventId: eventData.eventId,
                notificationId: eventData.notificationId,
                userId: eventData.userId,
                eventType: eventData.eventType,
                retryCount: Number(eventData.retryCount ?? 0),
            };

            console.log("Retry Event Received", event);

            // Max 3 retries
            if ((event.retryCount ?? 0) >= 3) {
                await publishDLQEvent(event);

                await redisConsumer.xack(
                    "retry-email-stream",
                    "retry-email-group",
                    messageId
                );

                console.log("Moved To DLQ");

                continue;
            }

            // Re-publish to email-stream
            await publishEmailEvent(event);

            await redisConsumer.xack(
                "retry-email-stream",
                "retry-email-group",
                messageId
            );

            console.log(
                `Republished For Retry #${event.retryCount}`
            );
        }
    }
}

consumeRetries().catch(console.error);