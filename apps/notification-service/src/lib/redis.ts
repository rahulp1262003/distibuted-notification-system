import { createRedisClient } from "@repo/core";
import { env } from "../config/env";

export const redis = createRedisClient(
    env.REDIS_HOST,
    env.REDIS_PORT
);