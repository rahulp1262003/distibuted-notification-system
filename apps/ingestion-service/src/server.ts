import app from "./app";
import { env } from "./config/env";
import { createConsumerGroup } from "./lib/consumer-group";
import { startNotificationConsumer } from "./consumers/notification.stream.consumer";

/**
 * Starts the HTTP server.
 */
app.listen(env.PORT, () => {
    console.log(
        `Ingestion Service running on http://localhost:${env.PORT}`
    );
});

/**
 * Bootstraps the Ingestion Service.
 */
async function bootstrap(): Promise<void> {

    try {

        await createConsumerGroup();

        await startNotificationConsumer();

    } catch (error) {

        console.error(
            "Failed to start Ingestion Service",
            error
        );

        process.exit(1);

    }

}

bootstrap();