import app from "./app";
import { env } from "./config/env";
import { startEmailConsumer } from "./consumers/email.stream.consumer";
import { createConsumerGroup } from "./lib/consumer-group";

/**
 * Starts the HTTP server.
 */
app.listen(env.PORT, () => {
    console.log(
        `Email Service running on http://localhost:${env.PORT}`
    );
});

/**
 * Starts the Redis Stream consumer.
 */
/**
 * Bootstraps the Email Service.
 */
async function bootstrap(): Promise<void> {

    try {

        await createConsumerGroup();

        await startEmailConsumer();

    } catch (error) {

        console.error(
            "Failed to start Email Service",
            error
        );

        process.exit(1);

    }

}

bootstrap();