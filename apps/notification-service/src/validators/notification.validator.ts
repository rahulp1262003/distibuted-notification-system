import { z } from "zod";

export const createNotificationSchema = z.object({
    userId: z.string().min(1),
    eventType: z.string().min(1),
    payload: z.record(z.string(), z.unknown())
});