
import { NotificationStatus } from "@prisma/client";
import { NotificationRepository } from "../repositories/notification.repository";
import { redisConsumer } from "../lib/redis-consumer";

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

        console.log("Notification Status Group Created");
    } catch (error: any) {
        if (error.message.includes("BUSYGROUP")) {
            console.log("Notification Status Group Already Exists");
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

            console.log(
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