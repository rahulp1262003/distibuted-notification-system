"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.startEmailConsumer = startEmailConsumer;
const redis_1 = require("../lib/redis");
const fake_email_provider_1 = require("../providers/fake-email.provider");
const email_consumer_1 = require("./email.consumer");
const provider = new fake_email_provider_1.FakeEmailProvider();
/**
 * Starts the Email Stream consumer.
 */
async function startEmailConsumer() {
    console.log("[EVENT] Waiting For Email Events...");
    while (true) {
        const response = await redis_1.redis.xreadgroup("GROUP", "email-group", "email-consumer-1", "COUNT", 1, "BLOCK", 0, "STREAMS", "email-stream", ">");
        if (!response) {
            continue;
        }
        const [, messages] = response[0];
        for (const [, values] of messages) {
            const event = {
                notificationId: values[3],
                userId: values[5],
                eventType: values[7],
            };
            await (0, email_consumer_1.processEmailEvent)(provider, event);
        }
    }
}
