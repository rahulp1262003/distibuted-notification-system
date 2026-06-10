import { NotificationCreatedEvent } from "@repo/event-contracts";
import { sendEmail } from "../services/email.service";
import { publishRetryEvent } from "../events/retry.publisher";
import { publishStatusEvent } from "../events/status.publisher";
import { redisConsumer } from "../lib/redis-consumer";


/**
 * Creates a Redis Consumer Group for email events.
 *
 * This group enables reliable message processing,
 * pending message tracking, and horizontal scaling.
 *
 * @throws {Error} When Redis command fails unexpectedly
 */
async function createConsumerGroup(): Promise<void> {
    try {
        await redisConsumer.xgroup(
            "CREATE",
            "email-stream",
            "email-group",
            "0",
            "MKSTREAM"
        );

        console.log("Consumer Group Created");
    } catch (error: any) {
        if (error.message.includes("BUSYGROUP")) {
            console.log("Consumer Group Already Exists");
            return;
        }

        throw error;
    }
}

async function consume() {

    await createConsumerGroup();

    while (true) {
        console.log("Waiting For Email Events...");
        const response = await redisConsumer.xreadgroup(
            "GROUP",
            "email-group",
            "consumer-1",
            "COUNT",
            10,
            "BLOCK",
            0,
            "STREAMS",
            "email-stream",
            ">"
        );

        if (!response) continue;
        console.log("Email Stream Response Received");
        const [, messages] = (response as any)[0];

        for (const [id, fields] of messages) {
            const eventData = Object.fromEntries(
                Array.from({ length: fields.length / 2 }, (_, i) => [
                    fields[i * 2],
                    fields[i * 2 + 1],
                ])
            );

            const event: NotificationCreatedEvent = {
                notificationId: eventData.notificationId,
                userId: eventData.userId,
                eventType: eventData.eventType,
                retryCount: Number(eventData.retryCount ?? 0),
            };

            console.log("Email Event Received", event);
            try {


                const success = await sendEmail();

                if (success) {
                    console.log("Email Sent Successfully");

                    await publishStatusEvent({
                        notificationId: event.notificationId,
                        status: "SENT",
                    });

                    await redisConsumer.xack(
                        "email-stream",
                        "email-group",
                        id
                    );

                    console.log("Message Acknowledged");
                } else {
                    console.log("Email Sending Failed");

                    await publishStatusEvent({
                        notificationId: event.notificationId,
                        status: "RETRYING",
                    });
                    await publishRetryEvent({
                        ...event,
                        retryCount: (event.retryCount ?? 0) + 1,
                    });

                    await redisConsumer.xack(
                        "email-stream",
                        "email-group",
                        id
                    );

                    console.log("Failed Message Acknowledged");
                }

            } catch (error) {
                console.error("Email Consumer Error:", error);
            }
        }
    }
}

consume().catch((error) => {
  console.error("EMAIL CONSUMER CRASHED");
  console.error(error);
});