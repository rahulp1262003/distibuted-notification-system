"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = void 0;
const chalk_1 = __importDefault(require("chalk"));
exports.logger = {
    info(message, ...args) {
        console.log(chalk_1.default.blue("[INFO]"), message, ...args);
    },
    success(message, ...args) {
        console.log(chalk_1.default.green("[SUCCESS]"), message, ...args);
    },
    warn(message, ...args) {
        console.log(chalk_1.default.yellow("[WARN]"), message, ...args);
    },
    error(message, ...args) {
        console.log(chalk_1.default.red("[ERROR]"), message, ...args);
    },
    event(message, ...args) {
        console.log(chalk_1.default.magenta("[EVENT]"), message, ...args);
    },
    stream(message, ...args) {
        console.log(chalk_1.default.cyan("[STREAM]"), message, ...args);
    },
};
