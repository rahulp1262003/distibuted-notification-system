"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createNotificationSchema = void 0;
const zod_1 = require("zod");
exports.createNotificationSchema = zod_1.z.object({
    userId: zod_1.z.string().min(1),
    eventType: zod_1.z.string().min(1),
    payload: zod_1.z.record(zod_1.z.string(), zod_1.z.unknown())
});
