"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationRepository = void 0;
const prisma_1 = require("../lib/prisma");
class NotificationRepository {
    /**
     * Creates a new notification record.
     */
    async create(data) {
        return prisma_1.prisma.notification.create({
            data,
        });
    }
    /**
     * Updates notification status.
     */
    async updateStatus(notificationId, status) {
        return prisma_1.prisma.notification.update({
            where: {
                id: notificationId,
            },
            data: {
                status,
            },
        });
    }
    /**
     * Finds notification by id.
     */
    async findById(notificationId) {
        return prisma_1.prisma.notification.findUnique({
            where: {
                id: notificationId,
            },
        });
    }
}
exports.NotificationRepository = NotificationRepository;
