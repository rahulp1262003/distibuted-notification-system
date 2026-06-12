"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.redisPublisher = void 0;
const ioredis_1 = __importDefault(require("ioredis"));
exports.redisPublisher = new ioredis_1.default({
    host: "localhost",
    port: 6379,
});
//# sourceMappingURL=redis-publisher.js.map