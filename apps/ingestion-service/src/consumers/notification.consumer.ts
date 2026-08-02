import { publishFanOutEvents } from "../events/fanout.publisher";
import { logger } from "../lib/logger";

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
        correlationId: string;
    }
): Promise<void> {

    logger.info(
        {
            correlationId: event.correlationId,
            notificationId: event.notificationId,
            userId: event.userId,
            eventType: event.eventType,
        },
        "Notification event received"
    );

    await publishFanOutEvents(event);

    logger.info(
        {
            correlationId: event.correlationId,
            notificationId: event.notificationId,
        },
        "Fan-out completed"
    );

}