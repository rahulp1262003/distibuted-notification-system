import { Prisma } from "@prisma/client";
import { NotificationRepository } from "../repositories/notification.repository";

export class NotificationService {
    private repository = new NotificationRepository();

    async createNotification(data: {
        userId: string;
        eventType: string;
        payload: Prisma.InputJsonValue;
    }) {
        return this.repository.create(data);
    }
}