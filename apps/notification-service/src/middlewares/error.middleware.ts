import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";

/**
 * Global error handling middleware.
 *
 * Handles:
 * - Zod validation errors (400)
 * - Generic application errors (500)
 */
export const errorMiddleware = (
    error: unknown,
    _req: Request,
    res: Response,
    _next: NextFunction
) => {

    /**
     * Log errors only outside the test environment.
     */
    if (process.env.NODE_ENV !== "test") {
        console.error(error);
    }

    /**
     * Handle request validation errors.
     */
    if (error instanceof ZodError) {
        return res.status(400).json({
            success: false,
            message: "Validation Failed",
            errors: error.issues.map((issue) => ({
                field: issue.path.join("."),
                message: issue.message,
            })),
        });
    }

    /**
     * Handle application errors.
     */
    if (error instanceof Error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }

    /**
     * Handle unknown errors.
     */
    return res.status(500).json({
        success: false,
        message: "Internal Server Error",
    });
};