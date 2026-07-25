import { SMSMessage, SMSProvider } from "./sms.provider";

/**
 * Fake SMS provider used during development and testing.
 */
export class FakeSMSProvider implements SMSProvider {

    /**
     * Simulates sending an SMS.
     */
    async send(message: SMSMessage): Promise<void> {

        console.log("SMS Sent");
        console.log(message);

    }

}