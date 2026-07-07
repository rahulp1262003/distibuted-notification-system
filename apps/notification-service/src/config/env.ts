import dotenv from "dotenv";
dotenv.config();

import { z } from "zod";

const envSchema = z.object({
    PORT: z.coerce.number().default(3001),

    DATABASE_URL: z
        .string()
        .min(1, "DATABASE_URL is required"),

    REDIS_HOST: z
        .string()
        .default("localhost"),

    REDIS_PORT: z.coerce
        .number()
        .default(6379),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
    const formattedError = z.treeifyError(parsed.error);

    throw new Error(
        `Invalid environment variables:\n${JSON.stringify(formattedError, null, 2)}`
    );
}

export const env = parsed.data;