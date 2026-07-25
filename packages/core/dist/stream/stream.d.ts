import Redis from "ioredis";
/**
 * Reads messages from a Redis Stream using a consumer group.
 */
export declare function readStream(redis: Redis, stream: string, group: string, consumer: string): Promise<unknown[]>;
/**
 * Acknowledges a processed message.
 */
export declare function ackMessage(redis: Redis, stream: string, group: string, id: string): Promise<void>;
//# sourceMappingURL=stream.d.ts.map