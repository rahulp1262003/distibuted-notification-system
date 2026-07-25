import { SMSProvider } from "../providers/sms.provider";
import { publishStatusEvent } from "../events/status.publisher";

/**
 * Processes an SMS notification event.
 *
 * @param provider SMS provider implementation.
 * @param event SMS notification payload.
 */
export async function processSMS(
    provider: SMSProvider,
    event: {
        notificationId: string;
        userId: string;
        eventType: string;
    }
): Promise<void> {

    await provider.send({
        to: `${event.userId}@example.com`,
        body: `Notification Id: ${event.notificationId}`,
    });

    await publishStatusEvent({
        notificationId: event.notificationId,
        channel: "SMS",
        status: "SENT",
    });

}