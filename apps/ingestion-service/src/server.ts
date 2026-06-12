import dotenv from "dotenv";
dotenv.config();
import { logger } from "@repo/logger";
import "./consumers/notification.consumer";

logger.info("Ingestion Service Running");