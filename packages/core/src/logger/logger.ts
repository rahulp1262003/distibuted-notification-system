import pino from "pino";
import { ServiceName } from "./types";

/**
 * Creates a structured logger for a service.
 *
 * @param service Service name.
 */
export function createLogger(
    service: ServiceName
) {

    return pino({
        name: service,

        level:
            process.env.NODE_ENV === "production"
                ? "info"
                : "debug",

        transport:
            process.env.NODE_ENV !== "production"
                ? {
                    target: "pino-pretty",
                    options: {
                        colorize: true,
                        translateTime: "SYS:standard",
                    },
                }
                : undefined,
    });

}