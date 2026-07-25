/**
 * Represents an SMS notification.
 */
export interface SMSMessage {
    to: string;
    body: string;
}

/**
 * Contract for SMS providers.
 */
export interface SMSProvider {

    /**
     * Sends an SMS.
     *
     * @param message SMS to send.
     */
    send(message: SMSMessage): Promise<void>;
}