"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.publishStatusEvent = publishStatusEvent;
const redis_publisher_1 = require("../lib/redis-publisher");
const logger_1 = require("@repo/logger");
async function publishStatusEvent(event) {
    await redis_publisher_1.redisPublisher.xadd("notification-status-stream", "*", "notificationId", event.notificationId, "status", event.status);
    logger_1.logger.event(`Status Event Published: ${event.status}`);
}
