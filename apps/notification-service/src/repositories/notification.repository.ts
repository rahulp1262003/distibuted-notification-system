import { NotificationStatus, Prisma } from "@prisma/client";
import { prisma } from "../lib/prisma";

export class NotificationRepository {
  /**
   * Creates a new notification record.
   */
  async create(data: {
    userId: string;
    eventType: string;
    payload: Prisma.InputJsonValue;
  }) {
    return prisma.notification.create({
      data,
    });
  }

  /**
   * Updates notification status.
   */
  async updateStatus(
    notificationId: string,
    status: NotificationStatus
  ) {
    return prisma.notification.update({
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
  async findById(notificationId: string) {
    return prisma.notification.findUnique({
      where: {
        id: notificationId,
      },
    });
  }
}