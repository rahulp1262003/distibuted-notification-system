"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationController = void 0;
const notification_service_1 = require("../services/notification.service");
const notificationService = new notification_service_1.NotificationService();
class NotificationController {
    async create(req, res, next) {
        try {
            const notification = await notificationService.createNotification(req.body);
            res.status(201).json({
                success: true,
                notificationId: notification.id,
            });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.NotificationController = NotificationController;
