import { createRedisClient } from "@repo/core";
import { env } from "../config/env";
import { logger } from "./logger";

/**
 * Shared Redis client used by the Ingestion Service.
 */
export const redis = createRedisClient(
    env.REDIS_HOST,
    env.REDIS_PORT
);

redis.on("connect", () => {
    logger.info("Redis connected");
});

redis.on("error", (error) => {
    logger.error(
        { err: error },
        "Redis connection failed"
    );
});