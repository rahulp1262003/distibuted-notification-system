"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.redis = void 0;
const core_1 = require("@repo/core");
const env_1 = require("../config/env");
exports.redis = (0, core_1.createRedisClient)(env_1.env.REDIS_HOST, env_1.env.REDIS_PORT);
