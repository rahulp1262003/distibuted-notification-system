import Redis from "ioredis";

/**
 * Creates a Redis client.
 */
export function createRedisClient(
    host: string,
    port: number
): Redis {
    return new Redis({
        host,
        port,
    });
}