import { Prisma } from "@prisma/client";

import { publishNotificationCreatedEvent } from "../events/publisher";
import { NotificationRepository } from "../repositories/notification.repository";

/**
 * Handles notification business logic.
 *
 * Responsibilities:
 * - Persists a notification into the database.
 * - Publishes a notification created event to Redis.
 */
export class NotificationService {

    /**
     * Creates a new NotificationService instance.
     *
     * Dependency Injection is used here so the repository
     * can be easily mocked during unit testing.
     *
     * @param repository Notification repository instance.
     */
    constructor(
        private readonly repository = new NotificationRepository()
    ) { }

    /**
     * Creates a new notification and publishes a notification event.
     *
     * Workflow:
     * 1. Store the notification in PostgreSQL.
     * 2. Publish a "notification.created" event to Redis Stream.
     * 3. Return the created notification.
     *
     * @param data Notification creation payload.
     * @returns Created notification record.
     */
    async createNotification(data: {
        userId: string;
        eventType: string;
        payload: Prisma.InputJsonValue;
    }) {

        // Persist notification in the database.
        const notification =
            await this.repository.create(data);

        // Publish the notification created event.
        await publishNotificationCreatedEvent({
            notificationId: notification.id,
            userId: notification.userId,
            eventType: notification.eventType,
        });

        // Return the created notification.
        return notification;
    }
}