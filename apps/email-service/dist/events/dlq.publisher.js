"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.publishDLQEvent = publishDLQEvent;
const status_publisher_1 = require("./status.publisher");
const redis_publisher_1 = require("../lib/redis-publisher");
const logger_1 = require("@repo/logger");
async function publishDLQEvent(event) {
    await redis_publisher_1.redisPublisher.xadd("email-dlq", "*", "eventId", event.eventId, "notificationId", event.notificationId, "userId", event.userId, "eventType", event.eventType, "retryCount", String(event.retryCount ?? 0));
    await (0, status_publisher_1.publishStatusEvent)({
        notificationId: event.notificationId,
        status: "FAILED",
    });
    logger_1.logger.info("Moved To DLQ");
}
