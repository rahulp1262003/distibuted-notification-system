import Redis from "ioredis";

const redis = new Redis({
    host: "localhost",
    port: 6379,
});

redis.on("connect", () => {
    console.log("Redis Connected");
});

/**
 * Creates a Redis Consumer Group for email events.
 *
 * This group enables reliable message processing,
 * pending message tracking, and horizontal scaling.
 *
 * @throws {Error} When Redis command fails unexpectedly
 */
async function createConsumerGroup(): Promise<void> {
    try {
        await redis.xgroup(
            "CREATE",
            "email-stream",
            "email-group",
            "0",
            "MKSTREAM"
        );

        console.log("Consumer Group Created");
    } catch (error: any) {
        if (error.message.includes("BUSYGROUP")) {
            console.log("Consumer Group Already Exists");
            return;
        }

        throw error;
    }
}

async function consume() {
    let lastId = "$";

    await createConsumerGroup();

    while (true) {
        const response = await redis.xreadgroup(
            "GROUP",
            "email-group",
            "consumer-1",
            "BLOCK",
            0,
            "COUNT",
            10,
            "STREAMS",
            "email-stream",
            ">"
        );

        if (!response) continue;

        const [, messages] = response[0];

        for (const [id, fields] of messages) {
            console.log("Email Event Received");

            console.log(id);

            console.log(fields);

            lastId = id;
        }
    }
}

consume();