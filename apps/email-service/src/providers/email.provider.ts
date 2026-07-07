/**
 * Represents an email notification.
 */
export interface EmailMessage {
    to: string;
    subject: string;
    body: string;
}

/**
 * Contract for email providers.
 */
export interface EmailProvider {

    /**
     * Sends an email.
     *
     * @param message Email to send.
     */
    send(message: EmailMessage): Promise<void>;
}