"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorMiddleware = void 0;
const zod_1 = require("zod");
const errorMiddleware = (error, _req, res, _next) => {
    console.error(error);
    // Zod Validation Error
    if (error instanceof zod_1.ZodError) {
        return res.status(400).json({
            success: false,
            message: "Validation Failed",
            errors: error.issues.map((issue) => ({
                field: issue.path.join("."),
                message: issue.message,
            })),
        });
    }
    // Generic Error
    if (error instanceof Error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
    return res.status(500).json({
        success: false,
        message: "Internal Server Error",
    });
};
exports.errorMiddleware = errorMiddleware;
