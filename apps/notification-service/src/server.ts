import app from "./app";
import { env } from "./config/env";
import { logger } from "./lib/logger";

app.listen(env.PORT, () => {
    logger.info(`Server running on port http://localhost:${env.PORT}`);
});