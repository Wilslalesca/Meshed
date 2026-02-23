type LogMeta = Record<string, unknown> | Error | undefined;
type LogLevel = "info" | "warn" | "error";

function formatMeta(meta: LogMeta): string {
    if (meta instanceof Error) {
        return JSON.stringify({ name: meta.name, message: meta.message, stack: meta.stack });
    }
    return JSON.stringify(meta);
}

function log(level: LogLevel, msg: string, meta?: LogMeta) {
    const message = formatMeta(meta);
    const pref = `${level.toUpperCase()}: ${msg}`;
    if ( message === undefined) console[level](pref);
    else console[level](pref, message);
}

export const logger = {
    info: (msg: string, meta?: LogMeta) => log("info", msg, meta),
    warn: (msg: string, meta?: LogMeta) => log("warn", msg, meta),
    error: (msg: string, meta?: LogMeta) => log("error", msg, meta),
};