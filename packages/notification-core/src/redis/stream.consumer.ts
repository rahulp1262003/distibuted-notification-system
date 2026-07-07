import Redis from "ioredis";

/**
 * Represents a Redis Stream event handler.
 */
export type StreamHandler = (
    id: string,
    values: string[]
) => Promise<void>;

/**
 * Creates a Redis Stream consumer.
 */
export class StreamConsumer {

    constructor(
        private readonly redis: Redis
    ) { }

}