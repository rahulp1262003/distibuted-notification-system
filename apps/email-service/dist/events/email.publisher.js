"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.publishEmailEvent = publishEmailEvent;
const redis_publisher_1 = require("../lib/redis-publisher");
const logger_1 = require("@repo/logger");
/**
 * Re-publishes email event for retry.
 */
async function publishEmailEvent(event) {
    await redis_publisher_1.redisPublisher.xadd("email-stream", "*", "eventId", event.eventId, "event", "notification.email.send", "notificationId", event.notificationId, "userId", event.userId, "eventType", event.eventType, "retryCount", String(event.retryCount ?? 0));
    logger_1.logger.stream("Republished To Email Stream");
}
