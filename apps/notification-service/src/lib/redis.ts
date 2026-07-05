import Redis from "ioredis";
import { env } from "../config/env";

export const redis = new Redis({
    host: env.REDIS_HOST,
    port: env.REDIS_PORT,
});

redis.on("connect", () => {
    console.log("Redis Connected");
});

redis.on("error", (error) => {
    console.error("Redis Error", error);
});