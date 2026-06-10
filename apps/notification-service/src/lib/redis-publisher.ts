import Redis from "ioredis";

export const redisPublisher = new Redis({
    host: "localhost",
    port: 6379,
});