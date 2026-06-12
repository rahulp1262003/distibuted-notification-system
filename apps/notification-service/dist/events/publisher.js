"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.publishNotificationCreatedEvent = publishNotificationCreatedEvent;
const redis_publisher_1 = require("../lib/redis-publisher");
/**
 * Publishes a notification created event to Redis Stream.
 *
 * @param event NotificationCreatedEvent payload
 */
async function publishNotificationCreatedEvent(event) {
    await redis_publisher_1.redisPublisher.xadd("notification-stream", "*", "eventId", event.eventId, "event", "notification.created", "notificationId", event.notificationId, "userId", event.userId, "eventType", event.eventType);
}
