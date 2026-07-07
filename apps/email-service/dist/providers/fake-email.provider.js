"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FakeEmailProvider = void 0;
/**
 * Fake email provider used during development and testing.
 */
class FakeEmailProvider {
    /**
     * Simulates sending an email.
     */
    async send(message) {
        console.log("Email Sent");
        console.log(message);
    }
}
exports.FakeEmailProvider = FakeEmailProvider;
