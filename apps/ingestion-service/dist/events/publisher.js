"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.publishFanOutEvents = publishFanOutEvents;
const redis_publisher_1 = require("../lib/redis-publisher");
const logger_1 = require("@repo/logger");
async function publishFanOutEvents(event) {
    await redis_publisher_1.redisPublisher.xadd("email-stream", "*", "eventId", event.eventId, "event", "notification.email.send", "notificationId", event.notificationId, "userId", event.userId, "eventType", event.eventType);
    await redis_publisher_1.redisPublisher.xadd("sms-stream", "*", "eventId", event.eventId, "event", "notification.sms.send", "notificationId", event.notificationId, "userId", event.userId, "eventType", event.eventType);
    await redis_publisher_1.redisPublisher.xadd("push-stream", "*", "eventId", event.eventId, "event", "notification.push.send", "notificationId", event.notificationId, "userId", event.userId, "eventType", event.eventType);
    logger_1.logger.success("Fan-Out Completed");
}
//# sourceMappingURL=publisher.js.map