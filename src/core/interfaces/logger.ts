export interface Logger {
    info(message: string, metadata?: object): void;
    error(message: string, error?: unknown): void;
    warn(message: string, metadata?: object): void;
}