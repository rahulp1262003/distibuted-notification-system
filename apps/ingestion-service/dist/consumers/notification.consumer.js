"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const publisher_1 = require("../events/publisher");
const redis_consumer_1 = require("../lib/redis-consumer");
const logger_1 = require("@repo/logger");
async function consume() {
    let lastId = "$";
    while (true) {
        const response = await redis_consumer_1.redisConsumer.xread("BLOCK", 0, "STREAMS", "notification-stream", lastId);
        if (!response)
            continue;
        const [, messages] = response[0];
        for (const [id, fields] of messages) {
            logger_1.logger.event("Received Event:");
            logger_1.logger.event(id);
            logger_1.logger.event(JSON.stringify(fields));
            const eventData = Object.fromEntries(Array.from({ length: fields.length / 2 }, (_, i) => [
                fields[i * 2],
                fields[i * 2 + 1],
            ]));
            const event = {
                eventId: eventData.eventId,
                notificationId: eventData.notificationId,
                userId: eventData.userId,
                eventType: eventData.eventType,
            };
            await (0, publisher_1.publishFanOutEvents)(event);
            lastId = id;
        }
    }
}
consume();
//# sourceMappingURL=notification.consumer.js.map