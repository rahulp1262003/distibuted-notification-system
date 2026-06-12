
import dotenv from "dotenv";
dotenv.config();

import app from "./app";
import "./consumers/notification-status.consumer";
import { logger } from "@repo/logger";

const PORT = Number(process.env.PORT) || 3001;
logger.info("PORT:", process.env.PORT);
app.listen(PORT, () => {
    logger.info(`Server running on port http://localhost:${PORT}`);
});