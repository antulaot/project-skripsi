import { Logger } from "@/core/interfaces/logger";


export class ConsoleLogger implements Logger {
    info(message: string, metadata?: object): void {
        const timestamp = new Date().toISOString();
        console.log(`[INFO] [${timestamp}] ${message}`, metadata? JSON.stringify(metadata): '');

    }

    error (message: string, error?: unknown): void {
     const timestamp = new Date().toISOString();
     console.error(`[ERROR] [${timestamp}] ${message}`, error);

    }

    warn(message: string, metadata?: object): void {
        const timestamp = new Date().toISOString();
        console.warn(`[WANR] [${timestamp}] ${message}`, metadata? JSON.stringify(metadata): '');
    }
}