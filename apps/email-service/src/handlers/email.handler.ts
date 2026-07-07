import { EmailProvider } from "../providers/email.provider";
import { publishStatusEvent } from "../events/status.publisher";

/**
 * Processes an email notification event.
 *
 * @param provider Email provider implementation.
 * @param event Email notification payload.
 */
export async function processEmail(
    provider: EmailProvider,
    event: {
        notificationId: string;
        userId: string;
        eventType: string;
    }
): Promise<void> {

    await provider.send({
        to: `${event.userId}@example.com`,
        subject: `Notification: ${event.eventType}`,
        body: `Notification Id: ${event.notificationId}`,
    });

    await publishStatusEvent({
        notificationId: event.notificationId,
        channel: "EMAIL",
        status: "SENT",
    });

}