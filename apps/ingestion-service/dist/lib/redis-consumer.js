"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.redisConsumer = void 0;
const ioredis_1 = __importDefault(require("ioredis"));
exports.redisConsumer = new ioredis_1.default({
    host: "localhost",
    port: 6379,
});
//# sourceMappingURL=redis-consumer.js.map