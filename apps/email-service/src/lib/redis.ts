import Redis from "ioredis";
import { env } from "../config/env";

/**
 * Shared Redis client used by the Email Service.
 */
export const redis = new Redis({
    host: env.REDIS_HOST,
    port: env.REDIS_PORT,
});

/**
 * Logs successful Redis connection.
 */
redis.on("connect", () => {

    if (process.env.NODE_ENV !== "test") {
        console.log("Redis Connected");
    }

});

/**
 * Logs Redis connection errors.
 */
redis.on("error", (error) => {

    if (process.env.NODE_ENV !== "test") {
        console.error("Redis Error", error);
    }

});