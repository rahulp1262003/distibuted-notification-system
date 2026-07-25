"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
const zod_1 = require("zod");
/**
 * Environment variables required by Email Service.
 */
const envSchema = zod_1.z.object({
    PORT: zod_1.z.coerce.number().default(3002),
    REDIS_HOST: zod_1.z
        .string()
        .default("localhost"),
    REDIS_PORT: zod_1.z.coerce
        .number()
        .default(6379),
});
/**
 * Validate environment variables.
 */
const parsed = envSchema.safeParse(process.env);
if (!parsed.success) {
    throw new Error(JSON.stringify(zod_1.z.treeifyError(parsed.error), null, 2));
}
exports.env = parsed.data;
