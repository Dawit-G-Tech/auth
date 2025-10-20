"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = void 0;
function timestamp() {
    return new Date().toISOString();
}
function shouldLogDebug() {
    const level = process.env.LOG_LEVEL || (process.env.NODE_ENV === 'production' ? 'info' : 'debug');
    return level === 'debug';
}
exports.logger = {
    debug: (...args) => {
        if (shouldLogDebug())
            console.debug(`[${timestamp()}] [DEBUG]`, ...args);
    },
    info: (...args) => {
        console.info(`[${timestamp()}] [INFO ]`, ...args);
    },
    warn: (...args) => {
        console.warn(`[${timestamp()}] [WARN ]`, ...args);
    },
    error: (...args) => {
        console.error(`[${timestamp()}] [ERROR]`, ...args);
    },
};
exports.default = exports.logger;
