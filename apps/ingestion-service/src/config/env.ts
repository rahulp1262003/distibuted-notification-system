import { z } from "zod";

/**
 * Environment variables required by Ingestion Service.
 */
const envSchema = z.object({
    PORT: z.coerce.number().default(3004),

    REDIS_HOST: z
        .string()
        .default("localhost"),

    REDIS_PORT: z.coerce
        .number()
        .default(6379),
});

/**
 * Validate environment variables.
 */
const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
    throw new Error(
        JSON.stringify(
            z.treeifyError(parsed.error),
            null,
            2
        )
    );
}

export const env = parsed.data;