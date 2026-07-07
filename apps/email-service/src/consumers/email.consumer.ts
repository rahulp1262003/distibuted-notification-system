import { EmailProvider } from "../providers/email.provider";
import { processEmail } from "../handlers/email.handler";

/**
 * Processes a notification event received
 * from the message broker.
 */
export async function processEmailEvent(
    provider: EmailProvider,
    event: {
        notificationId: string;
        userId: string;
        eventType: string;
    }
): Promise<void> {

    await processEmail(provider, event);

}