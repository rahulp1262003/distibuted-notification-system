"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.processEmail = processEmail;
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
}
