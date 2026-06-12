import dotenv from "dotenv";
dotenv.config();
import "./consumers/email.consumer";
import "./consumers/retry.consumer";
import { logger } from "@repo/logger";

// logger.info("REDIS_PORT:", process.env.REDIS_PORT);
logger.info("Email Service Running");