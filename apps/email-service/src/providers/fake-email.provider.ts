import { logger } from "../lib/logger";
import { EmailMessage, EmailProvider } from "./email.provider";

/**
 * Fake email provider used during development and testing.
 */
export class FakeEmailProvider implements EmailProvider {

    /**
     * Simulates sending an email.
     */
    async send(message: EmailMessage): Promise<void> {

        logger.info("Email Sent");
        logger.info(message);

    }

}