"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const email_service_1 = require("../services/email.service");
const retry_publisher_1 = require("../events/retry.publisher");
const status_publisher_1 = require("../events/status.publisher");
const redis_consumer_1 = require("../lib/redis-consumer");
const redis_publisher_1 = require("../lib/redis-publisher");
const logger_1 = require("@repo/logger");
/**
 * Creates a Redis Consumer Group for email events.
 *
 * This group enables reliable message processing,
 * pending message tracking, and horizontal scaling.
 *
 * @throws {Error} When Redis command fails unexpectedly
 */
async function createConsumerGroup() {
    try {
        await redis_consumer_1.redisConsumer.xgroup("CREATE", "email-stream", "email-group", "0", "MKSTREAM");
        logger_1.logger.info("Consumer Group Created");
    }
    catch (error) {
        if (error.message.includes("BUSYGROUP")) {
            logger_1.logger.info("Consumer Group Already Exists");
            return;
        }
        throw error;
    }
}
async function consume() {
    await createConsumerGroup();
    while (true) {
        logger_1.logger.event("Waiting For Email Events...");
        const response = await redis_consumer_1.redisConsumer.xreadgroup("GROUP", "email-group", "consumer-1", "COUNT", 10, "BLOCK", 0, "STREAMS", "email-stream", ">");
        if (!response)
            continue;
        logger_1.logger.stream("Email Stream Response Received");
        const [, messages] = response[0];
        for (const [id, fields] of messages) {
            const eventData = Object.fromEntries(Array.from({ length: fields.length / 2 }, (_, i) => [
                fields[i * 2],
                fields[i * 2 + 1],
            ]));
            const event = {
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
            const processed = await redis_publisher_1.redisPublisher.setnx(key, "true");
            if (!processed) {
                logger_1.logger.info(`Duplicate Event Ignored: ${event.eventId}`);
                await redis_consumer_1.redisConsumer.xack("email-stream", "email-group", id);
                continue;
            }
            logger_1.logger.stream("Email Event Received", event);
            try {
                const success = await (0, email_service_1.sendEmail)();
                if (success) {
                    logger_1.logger.success("Email Sent Successfully");
                    await (0, status_publisher_1.publishStatusEvent)({
                        notificationId: event.notificationId,
                        status: "SENT",
                    });
                    await redis_consumer_1.redisConsumer.xack("email-stream", "email-group", id);
                    logger_1.logger.info("Message Acknowledged");
                }
                else {
                    logger_1.logger.error("Email Sending Failed");
                    await (0, status_publisher_1.publishStatusEvent)({
                        notificationId: event.notificationId,
                        status: "RETRYING",
                    });
                    await (0, retry_publisher_1.publishRetryEvent)({
                        ...event,
                        retryCount: (event.retryCount ?? 0) + 1,
                    });
                    await redis_consumer_1.redisConsumer.xack("email-stream", "email-group", id);
                    logger_1.logger.error("Failed Message Acknowledged");
                }
            }
            catch (error) {
                logger_1.logger.error("Email Consumer Error:", error);
            }
        }
    }
}
consume().catch((error) => {
    logger_1.logger.error("EMAIL CONSUMER CRASHED");
    logger_1.logger.error(error);
});
