"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRedisClient = createRedisClient;
const ioredis_1 = __importDefault(require("ioredis"));
/**
 * Creates and configures a Redis client.
 */
function createRedisClient(host, port) {
    const redis = new ioredis_1.default({
        host,
        port,
    });
    redis.on("connect", () => {
        console.log("Redis Connected");
    });
    redis.on("error", (err) => {
        console.error("Redis Error", err);
    });
    return redis;
}
