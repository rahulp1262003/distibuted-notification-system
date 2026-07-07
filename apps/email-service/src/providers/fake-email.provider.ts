import { EmailMessage, EmailProvider } from "./email.provider";

/**
 * Fake email provider used during development and testing.
 */
export class FakeEmailProvider implements EmailProvider {

    /**
     * Simulates sending an email.
     */
    async send(message: EmailMessage): Promise<void> {

        console.log("Email Sent");
        console.log(message);

    }

}