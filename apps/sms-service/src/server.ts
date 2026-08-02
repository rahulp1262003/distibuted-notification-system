import app from "./app";
import { env } from "./config/env";
import { createConsumerGroup } from "./lib/consumer-group";
import { startSMSConsumer } from "./consumers/sms.stream.consumer";
import { logger } from "./lib/logger";

/**
 * Starts the HTTP server.
 */
app.listen(env.PORT, () => {
    logger.info(
        `SMS Service running on http://localhost:${env.PORT}`
    );
});

/**
 * Bootstraps the Ingestion Service.
 */
async function bootstrap(): Promise<void> {

    try {

        await createConsumerGroup();

        await startSMSConsumer();

    } catch (error) {

        logger.error(`Failed to start SMS Service : \n${error}`);

        process.exit(1);

    }

}

bootstrap();