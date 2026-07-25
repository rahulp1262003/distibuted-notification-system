import Redis from "ioredis";

/**
 * Creates and configures a Redis client.
 */
export function createRedisClient(
    host: string,
    port: number
): Redis {

    const redis = new Redis({
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