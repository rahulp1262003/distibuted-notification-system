"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.publishRetryEvent = publishRetryEvent;
const redis_publisher_1 = require("../lib/redis-publisher");
const crypto_1 = require("crypto");
const logger_1 = require("@repo/logger");
/**
 * Publishes failed email events for retry processing.
*/
async function publishRetryEvent(event) {
    const retryCount = event.retryCount ?? 0;
    const delaySeconds = Math.pow(2, retryCount);
    const retryEvent = {
        ...event,
        eventId: (0, crypto_1.randomUUID)(),
        scheduledAt: Date.now() + delaySeconds * 1000,
    };
    logger_1.logger.info(`Retry Scheduled In ${delaySeconds}s`);
    await redis_publisher_1.redisPublisher.xadd("retry-email-stream", "*", "eventId", retryEvent.eventId, "notificationId", retryEvent.notificationId, "userId", retryEvent.userId, "eventType", retryEvent.eventType, "retryCount", String(retryEvent.retryCount ?? 0), "scheduledAt", String(retryEvent.scheduledAt));
    logger_1.logger.event("Retry Event Published");
}
