import Redis from "ioredis";
/**
 * Creates a Redis Stream consumer group if it does not already exist.
 *
 * @param redis Redis client.
 * @param stream Stream name.
 * @param group Consumer group name.
 */
export declare function createConsumerGroup(redis: Redis, stream: string, group: string): Promise<boolean>;
//# sourceMappingURL=consumer-group.d.ts.map