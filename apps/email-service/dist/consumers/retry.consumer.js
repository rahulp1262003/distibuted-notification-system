"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const email_publisher_1 = require("../events/email.publisher");
const dlq_publisher_1 = require("../events/dlq.publisher");
const redis_consumer_1 = require("../lib/redis-consumer");
const logger_1 = require("@repo/logger");
/**
 * Creates consumer group for retry-email-stream.
 */
async function createRetryConsumerGroup() {
    try {
        await redis_consumer_1.redisConsumer.xgroup("CREATE", "retry-email-stream", "retry-email-group", "0", "MKSTREAM");
        logger_1.logger.info("Retry Consumer Group Created");
    }
    catch (error) {
        if (error.message.includes("BUSYGROUP")) {
            logger_1.logger.info("Retry Consumer Group Already Exists");
            return;
        }
        throw error;
    }
}
/**
 * Consumes retry events.
 */
async function consumeRetries() {
    await createRetryConsumerGroup();
    while (true) {
        const response = await redis_consumer_1.redisConsumer.xreadgroup("GROUP", "retry-email-group", "retry-consumer-1", "COUNT", 10, "BLOCK", 0, "STREAMS", "retry-email-stream", ">");
        if (!response)
            continue;
        const [, messages] = response[0];
        for (const [messageId, fields] of messages) {
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
                scheduledAt: Number(eventData.scheduledAt ?? 0),
            };
            logger_1.logger.info("Retry Event Received", event);
            // Max 3 retries
            if ((event.retryCount ?? 0) >= 3) {
                await (0, dlq_publisher_1.publishDLQEvent)(event);
                await redis_consumer_1.redisConsumer.xack("retry-email-stream", "retry-email-group", messageId);
                logger_1.logger.info("Moved To DLQ");
                continue;
            }
            const waitTime = (event.scheduledAt ?? 0) - Date.now();
            if (waitTime > 0) {
                logger_1.logger.info(`Waiting ${Math.ceil(waitTime / 1000)}s before retry`);
                await new Promise((resolve) => setTimeout(resolve, waitTime));
            }
            // Re-publish to email-stream
            await (0, email_publisher_1.publishEmailEvent)(event);
            await redis_consumer_1.redisConsumer.xack("retry-email-stream", "retry-email-group", messageId);
            logger_1.logger.event(`Republished For Retry #${event.retryCount}`);
        }
    }
}
consumeRetries().catch(console.error);
