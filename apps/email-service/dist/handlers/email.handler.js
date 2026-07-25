"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.processEmail = processEmail;
const status_publisher_1 = require("../events/status.publisher");
/**
 * Processes an email notification event.
 *
 * @param provider Email provider implementation.
 * @param event Email notification payload.
 */
async function processEmail(provider, event) {
    await provider.send({
        to: `${event.userId}@example.com`,
        subject: `Notification: ${event.eventType}`,
        body: `Notification Id: ${event.notificationId}`,
    });
    await (0, status_publisher_1.publishStatusEvent)({
        notificationId: event.notificationId,
        channel: "EMAIL",
        status: "SENT",
    });
}
