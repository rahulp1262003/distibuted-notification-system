"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pollOnce = pollOnce;
exports.startEmailConsumer = startEmailConsumer;
const fake_email_provider_1 = require("../providers/fake-email.provider");
const email_consumer_1 = require("./email.consumer");
const stream_1 = require("../lib/stream");
const retry_publisher_1 = require("../events/retry.publisher");
const retry_1 = require("../utils/retry");
const dlq_publisher_1 = require("../events/dlq.publisher");
const retry_2 = require("../utils/retry");
const provider = new fake_email_provider_1.FakeEmailProvider();
/**
 * Polls a single message from the email stream.
 */
async function pollOnce() {
    const response = await (0, stream_1.readEmailStream)("email-stream", "email-group", "email-consumer-1");
    if (!response || response.length === 0) {
        return;
    }
    const [, messages] = response[0];
    for (const [messageId, values] of messages) {
        const event = {
            notificationId: values[3],
            userId: values[5],
            eventType: values[7],
            retryCount: values[9] ? Number(values[9]) : 0,
        };
        try {
            await (0, email_consumer_1.processEmailEvent)(provider, {
                notificationId: values[3],
                userId: values[5],
                eventType: values[7],
            });
        }
        catch (error) {
            const retryCount = (0, retry_2.getNextRetryCount)(event.retryCount);
            if ((0, retry_1.canRetry)(retryCount)) {
                await (0, retry_publisher_1.publishRetryEvent)({
                    notificationId: event.notificationId,
                    userId: event.userId,
                    eventType: event.eventType,
                    channel: "EMAIL",
                    retryCount,
                });
            }
            else {
                await (0, dlq_publisher_1.publishDLQEvent)({
                    notificationId: event.notificationId,
                    userId: event.userId,
                    eventType: event.eventType,
                    channel: "EMAIL",
                    retryCount,
                });
            }
            throw error;
        }
        await (0, stream_1.ackEmailMessage)("email-stream", "email-group", messageId);
    }
}
/**
 * Starts the email consumer.
 */
async function startEmailConsumer() {
    console.log("[EMAIL] Consumer Started");
    while (true) {
        await pollOnce();
    }
}
