
import { NotificationStatus } from "@prisma/client";
import { NotificationRepository } from "../repositories/notification.repository";
import { redisConsumer } from "../lib/redis-consumer";
import { logger } from "@repo/logger";

const repository = new NotificationRepository();

async function createConsumerGroup() {
    try {
        await redisConsumer.xgroup(
            "CREATE",
            "notification-status-stream",
            "notification-status-group",
            "0",
            "MKSTREAM"
        );

        logger.info("Notification Status Group Created");
    } catch (error: any) {
        if (error.message.includes("BUSYGROUP")) {
            logger.info("Notification Status Group Already Exists");
            return;
        }

        throw error;
    }
}

async function consume() {
    await createConsumerGroup();

    while (true) {
        const response = await redisConsumer.xreadgroup(
            "GROUP",
            "notification-status-group",
            "notification-consumer-1",
            "COUNT",
            10,
            "BLOCK",
            0,
            "STREAMS",
            "notification-status-stream",
            ">"
        );

        if (!response) continue;

        const [, messages] = (response as any)[0];

        for (const [messageId, fields] of messages) {
            const eventData = Object.fromEntries(
                Array.from({ length: fields.length / 2 }, (_, i) => [
                    fields[i * 2],
                    fields[i * 2 + 1],
                ])
            );

            await repository.updateStatus(
                eventData.notificationId,
                eventData.status as NotificationStatus
            );

            logger.event(
                `Notification ${eventData.notificationId} updated to ${eventData.status}`
            );

            await redisConsumer.xack(
                "notification-status-stream",
                "notification-status-group",
                messageId
            );
        }
    }
}

consume().catch(console.error);