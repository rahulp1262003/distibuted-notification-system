"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationService = void 0;
const notification_repository_1 = require("../repositories/notification.repository");
const publisher_1 = require("../events/publisher");
const crypto_1 = require("crypto");
class NotificationService {
    repository = new notification_repository_1.NotificationRepository();
    async createNotification(data) {
        const notification = await this.repository.create(data);
        await (0, publisher_1.publishNotificationCreatedEvent)({
            eventId: (0, crypto_1.randomUUID)(),
            notificationId: notification.id,
            userId: notification.userId,
            eventType: notification.eventType,
        });
        return notification;
    }
}
exports.NotificationService = NotificationService;
