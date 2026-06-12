export declare const logger: {
    info(message: string, ...args: unknown[]): void;
    success(message: string, ...args: unknown[]): void;
    warn(message: string, ...args: unknown[]): void;
    error(message: string, ...args: unknown[]): void;
    event(message: string, ...args: unknown[]): void;
    stream(message: string, ...args: unknown[]): void;
};
