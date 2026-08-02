import { SMSMessage, SMSProvider } from "./sms.provider";
import {logger} from "../lib/logger";

/**
 * Fake SMS provider used during development and testing.
 */
export class FakeSMSProvider implements SMSProvider {

    /**
     * Simulates sending an SMS.
     */
    async send(message: SMSMessage): Promise<void> {

        logger.info("SMS Sent");
        logger.info(message);

    }

}