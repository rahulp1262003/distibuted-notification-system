"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmail = sendEmail;
/**
 * Simulates email delivery.
 *
 * Returns:
 * true  => email sent
 * false => email failed
 */
async function sendEmail() {
    return Math.random() > 0.5;
}
