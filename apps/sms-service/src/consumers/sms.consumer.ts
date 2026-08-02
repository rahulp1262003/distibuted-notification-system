import { SMSProvider } from "../providers/sms.provider";
import { processSMS } from "../handlers/sms.handler";
import {logger} from "../lib/logger";

/**
 * Processes a notification event received
 * from the message broker.
 */
export async function processSMSEvent(
    provider: SMSProvider,
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
        "SMS event received"
    );
    await processSMS(provider, event);
    logger.info(
        {
            correlationId: event.correlationId,
            notificationId: event.notificationId,
        },
        "SMS sent"
    );
}