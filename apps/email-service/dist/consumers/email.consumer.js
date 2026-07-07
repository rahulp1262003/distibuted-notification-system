"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.processEmailEvent = processEmailEvent;
const email_handler_1 = require("../handlers/email.handler");
/**
 * Processes a notification event received
 * from the message broker.
 */
async function processEmailEvent(provider, event) {
    await (0, email_handler_1.processEmail)(provider, event);
}
