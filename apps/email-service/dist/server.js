"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const env_1 = require("./config/env");
const email_stream_consumer_1 = require("./consumers/email.stream.consumer");
const consumer_group_1 = require("./lib/consumer-group");
/**
 * Starts the HTTP server.
 */
app_1.default.listen(env_1.env.PORT, () => {
    console.log(`Email Service running on http://localhost:${env_1.env.PORT}`);
});
/**
 * Starts the Redis Stream consumer.
 */
/**
 * Bootstraps the Email Service.
 */
async function bootstrap() {
    try {
        await (0, consumer_group_1.createConsumerGroup)();
        await (0, email_stream_consumer_1.startEmailConsumer)();
    }
    catch (error) {
        console.error("Failed to start Email Service", error);
        process.exit(1);
    }
}
bootstrap();
