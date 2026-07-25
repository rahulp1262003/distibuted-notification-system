import { publishFanOutEvents } from "../events/fanout.publisher";

/**
 * Processes a notification event received
 * from the notification stream.
 *
 * @param event Notification event payload.
 */
export async function processNotificationEvent(
    event: {
        notificationId: string;
        userId: string;
        eventType: string;
    }
): Promise<void> {

    console.log("Notification Event Received : ", event);

    await publishFanOutEvents(event);

    console.log(
        `[INGESTION] Fan-out completed for ${event.notificationId}`
    );

}