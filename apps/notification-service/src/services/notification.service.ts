import { NotificationRepository } from "../repositories/notification.repository";
import { publishNotificationCreatedEvent } from "../events/publisher";
import { Prisma } from "@prisma/client";

export class NotificationService {
  private repository = new NotificationRepository();

  async createNotification(data: {
    userId: string;
    eventType: string;
    payload: Prisma.InputJsonValue;
  }) {
    const notification = await this.repository.create(data);

    await publishNotificationCreatedEvent({
      notificationId: notification.id,
      userId: notification.userId,
      eventType: notification.eventType,
    });

    return notification;
  }
}