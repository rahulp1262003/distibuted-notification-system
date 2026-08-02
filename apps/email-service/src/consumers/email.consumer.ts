import {EmailProvider} from "../providers/email.provider";
import {processEmail} from "../handlers/email.handler";
import {logger} from "../lib/logger";

/**
 * Processes a notification event received
 * from the message broker.
 */
export async function processEmailEvent(
    provider: EmailProvider,
    event: {
        correlationId: string;
        notificationId: string;
        userId: string;
        eventType: string;
    }
): Promise<void> {
    logger.info(
        {
            correlationId: event.correlationId,
            notificationId: event.notificationId,
            userId: event.userId,
            eventType: event.eventType,
        },
        "Email event received"
    );

    await processEmail(provider, event);

    logger.info(
        {
            correlationId: event.correlationId,
            notificationId: event.notificationId,
        },
        "Email Sent"
    );

}