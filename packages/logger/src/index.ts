import chalk from "chalk";

export const logger = {
    info(message: string, ...args: unknown[]) {
        console.log(
            chalk.blue("[INFO]"),
            message,
            ...args
        );
    },

    success(message: string, ...args: unknown[]) {
        console.log(
            chalk.green("[SUCCESS]"),
            message,
            ...args
        );
    },

    warn(message: string, ...args: unknown[]) {
        console.log(
            chalk.yellow("[WARN]"),
            message,
            ...args
        );
    },

    error(message: string, ...args: unknown[]) {
        console.log(
            chalk.red("[ERROR]"),
            message,
            ...args
        );
    },

    event(message: string, ...args: unknown[]) {
        console.log(
            chalk.magenta("[EVENT]"),
            message,
            ...args
        );
    },

    stream(message: string, ...args: unknown[]) {
        console.log(
            chalk.cyan("[STREAM]"),
            message,
            ...args
        );
    },
};