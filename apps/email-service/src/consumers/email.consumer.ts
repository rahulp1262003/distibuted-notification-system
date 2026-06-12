import { NotificationCreatedEvent } from "@repo/event-contracts";
import { sendEmail } from "../services/email.service";
import { publishRetryEvent } from "../events/retry.publisher";
import { publishStatusEvent } from "../events/status.publisher";
import { redisConsumer } from "../lib/redis-consumer";
import { redisPublisher } from "../lib/redis-publisher";
import { logger } from "@repo/logger";

/**
 * Creates a Redis Consumer Group for email events.
 *
 * This group enables reliable message processing,
 * pending message tracking, and horizontal scaling.
 *
 * @throws {Error} When Redis command fails unexpectedly
 */
async function createConsumerGroup(): Promise<void> {
    try {
        await redisConsumer.xgroup(
            "CREATE",
            "email-stream",
            "email-group",
            "0",
            "MKSTREAM"
        );

        logger.info("Consumer Group Created");
    } catch (error: any) {
        if (error.message.includes("BUSYGROUP")) {
            logger.info("Consumer Group Already Exists");
            return;
        }

        throw error;
    }
}

async function consume() {

    await createConsumerGroup();

    while (true) {
        logger.event("Waiting For Email Events...");
        const response = await redisConsumer.xreadgroup(
            "GROUP",
            "email-group",
            "consumer-1",
            "COUNT",
            10,
            "BLOCK",
            0,
            "STREAMS",
            "email-stream",
            ">"
        );

        if (!response) continue;
        logger.stream("Email Stream Response Received");
        const [, messages] = (response as any)[0];

        for (const [id, fields] of messages) {
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

            /**
            * Idempotency Check
            *
            * Prevents duplicate processing
            * of the same event.
            */

            const key = `processed:${event.eventId}`;

            /* const processed = await redisPublisher.set(
                `processed:${event.eventId}`,
                "true",
                "NX",
                "EX",
                86400 // 24 hours
            ); */

            const processed = await redisPublisher.setnx(
                key,
                "true"
            );

            if (!processed) {
                logger.info(
                    `Duplicate Event Ignored: ${event.eventId}`
                );

                await redisConsumer.xack(
                    "email-stream",
                    "email-group",
                    id
                );

                continue;
            }

            logger.stream("Email Event Received", event);
            try {


                const success = await sendEmail();

                if (success) {
                    logger.success("Email Sent Successfully");

                    await publishStatusEvent({
                        notificationId: event.notificationId,
                        status: "SENT",
                    });

                    await redisConsumer.xack(
                        "email-stream",
                        "email-group",
                        id
                    );

                    logger.info("Message Acknowledged");
                } else {
                    logger.error("Email Sending Failed");

                    await publishStatusEvent({
                        notificationId: event.notificationId,
                        status: "RETRYING",
                    });
                    await publishRetryEvent({
                        ...event,
                        retryCount: (event.retryCount ?? 0) + 1,
                    });

                    await redisConsumer.xack(
                        "email-stream",
                        "email-group",
                        id
                    );

                    logger.error("Failed Message Acknowledged");
                }

            } catch (error) {
                logger.error("Email Consumer Error:", error);
            }
        }
    }
}

consume().catch((error) => {
    logger.error("EMAIL CONSUMER CRASHED");
    logger.error(error);
});