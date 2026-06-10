import Redis from "ioredis";

export const redisConsumer = new Redis({
    host: "localhost",
    port: 6379,
});