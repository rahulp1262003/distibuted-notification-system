import app from "./app";
import { env } from "./config/env";
import { createConsumerGroup } from "./lib/consumer-group";
import { startNotificationConsumer } from "./consumers/notification.stream.consumer";
import { logger } from "./lib/logger";

/**
 * Starts the HTTP server.
 */
app.listen(env.PORT, () => {
    logger.info(
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

        logger.error(`Failed to start Ingestion Service : \n${error}`);

        process.exit(1);

    }

}

bootstrap();