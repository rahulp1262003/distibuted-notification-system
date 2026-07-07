"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.redis = void 0;
const ioredis_1 = __importDefault(require("ioredis"));
const env_1 = require("../config/env");
/**
 * Shared Redis client used by the Email Service.
 */
exports.redis = new ioredis_1.default({
    host: env_1.env.REDIS_HOST,
    port: env_1.env.REDIS_PORT,
});
/**
 * Logs successful Redis connection.
 */
exports.redis.on("connect", () => {
    if (process.env.NODE_ENV !== "test") {
        console.log("Redis Connected");
    }
});
/**
 * Logs Redis connection errors.
 */
exports.redis.on("error", (error) => {
    if (process.env.NODE_ENV !== "test") {
        console.error("Redis Error", error);
    }
});
