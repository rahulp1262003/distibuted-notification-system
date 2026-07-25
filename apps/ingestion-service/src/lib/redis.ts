import { createRedisClient } from "@repo/core";
import { env } from "../config/env";

/**
 * Shared Redis client used by the Ingestion Service.
 */
export const redis = createRedisClient(
    env.REDIS_HOST,
    env.REDIS_PORT
);