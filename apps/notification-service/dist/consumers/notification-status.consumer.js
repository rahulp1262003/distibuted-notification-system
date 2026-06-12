"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const notification_repository_1 = require("../repositories/notification.repository");
const redis_consumer_1 = require("../lib/redis-consumer");
const logger_1 = require("@repo/logger");
const repository = new notification_repository_1.NotificationRepository();
async function createConsumerGroup() {
    try {
        await redis_consumer_1.redisConsumer.xgroup("CREATE", "notification-status-stream", "notification-status-group", "0", "MKSTREAM");
        logger_1.logger.info("Notification Status Group Created");
    }
    catch (error) {
        if (error.message.includes("BUSYGROUP")) {
            logger_1.logger.info("Notification Status Group Already Exists");
            return;
        }
        throw error;
    }
}
async function consume() {
    await createConsumerGroup();
    while (true) {
        const response = await redis_consumer_1.redisConsumer.xreadgroup("GROUP", "notification-status-group", "notification-consumer-1", "COUNT", 10, "BLOCK", 0, "STREAMS", "notification-status-stream", ">");
        if (!response)
            continue;
        const [, messages] = response[0];
        for (const [messageId, fields] of messages) {
            const eventData = Object.fromEntries(Array.from({ length: fields.length / 2 }, (_, i) => [
                fields[i * 2],
                fields[i * 2 + 1],
            ]));
            await repository.updateStatus(eventData.notificationId, eventData.status);
            logger_1.logger.event(`Notification ${eventData.notificationId} updated to ${eventData.status}`);
            await redis_consumer_1.redisConsumer.xack("notification-status-stream", "notification-status-group", messageId);
        }
    }
}
consume().catch(console.error);
