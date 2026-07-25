import { SMSProvider } from "../providers/sms.provider";
import { processSMS } from "../handlers/sms.handler";

/**
 * Processes a notification event received
 * from the message broker.
 */
export async function processSMSEvent(
    provider: SMSProvider,
    event: {
        notificationId: string;
        userId: string;
        eventType: string;
    }
): Promise<void> {

    await processSMS(provider, event);

}